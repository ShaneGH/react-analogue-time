
import { CommonData, InitializeTimeData } from "analogue-time-picker"

type TimePickerProps =
    {
        /** add event handler fired when the input value changes */
        onTimeChanged?: (hour: number, minute: number) => void
    }

export type Props = 
    React.InputHTMLAttributes<HTMLInputElement> &
    CommonData & 
    InitializeTimeData &
    TimePickerProps
    
export class TimePicker extends React.Component<Props> {}