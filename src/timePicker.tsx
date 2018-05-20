import { CommonData, InitializeTimeData, TimePickerInput, timePickerInput } from 'analogue-time-picker';
import * as React from 'react';

type TimePickerProps =
    {
        onTimeChanged?: (hour: number, minute: number) => void
    }
    
type Props = 
    React.InputHTMLAttributes<HTMLInputElement> &
    CommonData & 
    InitializeTimeData &
    TimePickerProps

declare var process: any;
const production = process.env.NODE_ENV === "production";

var validate = /^\s*\d{1,2}\s*:\s*\d{1,2}\s*((am)|(pm))?\s*$/i;
function parseTime(time: string) {
    if (!time || !validate.test(time)) return null;

    var split = time.split(":");
    var output =  {
        hour: parseInt(split[0]),
        minute: parseInt(split[1])
    }

    if (output.minute < 0 || output.minute > 59) return null;

    if (/am/i.test(split[1])) {
        if (output.hour < 1 || output.hour > 12) return null;
    } else if (/pm/i.test(split[1])) {
        if (output.hour < 1 || output.hour > 12) return null;
        if (output.hour === 12) output.hour = 0;
        else output.hour += 12;
    } else {
        if (output.hour < 0 || output.hour > 23) return null;
    }

    return output;
}

// cache the value from the input prototype
const valueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value") as PropertyDescriptor;
const valueSet = valueDescriptor.set as (x: any) => void;

/** Convert the "value" of an input into a property which triggers a change event */
function attachChangeEventToValueChange(input: HTMLInputElement, handler: (hour: number, minute: number) => void) {
    // define our own setter for value which triggers handler
    Object.defineProperty(input, "value", {
        ...valueDescriptor,
        set: function (val: any) {
            var oldValue = input.value;
            valueSet.apply(this, arguments);
            
            if (oldValue !== input.value) {
                var time = parseTime(input.value);
                if (time) {
                    handler(time.hour, time.minute);
                }
            }
        }
    });
}

function buildInputProps (p: Props): React.InputHTMLAttributes<HTMLInputElement> {
    var pr = {...p};

    if (pr.value && pr.time && !production) {
        console.warn(`The "time" prop will override the "value" prop. It is best to only set one of these.`);
    }
    
    // remove timePicker properties
    if (pr.onTimeChanged) delete pr.onTimeChanged;
    if (pr.mode) delete pr.mode;
    if (pr.width) delete pr.width;
    if (pr.time) delete pr.time;

    if (pr.onChange) {
        if (!production) {
            console.warn(`The onChange event is not reliable for this component. Use onTimeChanged instead.`);
        }
    } else {
        // suppress warning for no change handler on input
        pr.onChange = () => {}
    }

    return pr;
}

class TimePicker extends React.Component<Props> {

    private inputProps: React.InputHTMLAttributes<HTMLInputElement>
    private _inputRef = React.createRef<HTMLInputElement>()

    constructor(props: Props, context?: any) {
        super(props, context);

        this.inputProps = buildInputProps(props);
    }

    render() {
        return <input {...this.inputProps} ref={this._inputRef} />
    }

    componentDidMount() {
        this._createTimePicker();
    }

    componentDidUpdate() {
        this._createTimePicker();
    }

    componentWillUnmount() {
        this._removeTimePicker();
    }

    private _previousInput: { input: HTMLInputElement, picker: TimePickerInput} | null = null
    private _createTimePicker () {
        // nothing has changed/nothing to create
        if (!this._previousInput && !this._inputRef.current) return;
        if (this._previousInput && this._previousInput.input === this._inputRef.current) return;

        // dispose of previous
        this._removeTimePicker();

        // create new
        if (this._inputRef.current) {
            this._previousInput = {
                input: this._inputRef.current,
                picker: timePickerInput({ 
                    mode: this.props.mode,
                    time: this.props.time,
                    width: this.props.width,
                    inputElement: this._inputRef.current
                })
            };
            
            if (this.props.onTimeChanged) {
                // attach after timePickerInput(...) call, as this may set the input value
                attachChangeEventToValueChange(this._inputRef.current, this.props.onTimeChanged);
            }
        }
    }

    private _removeTimePicker() {        
        // dispose of time picker
        if (this._previousInput) {
            this._previousInput.picker.dispose();
            this._previousInput = null;
        }
    }
}

export {
    TimePicker
}