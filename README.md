# react-analogue-time
A small and simple time picker for react based on google material UI. This component is a wrapper for https://github.com/ShaneGH/analogue-time-picker

![time picker](https://raw.githubusercontent.com/ShaneGH/analogue-time-picker/master/docs/timePicker.png)

 * 12h and 24h versions
 * Mobile and desktop enabled
 * Custom styles, and works with material UI
 * Typescript typings included
 * Responsive
 * Accessable

## Install

`npm install react-analogue-time --save`

https://github.com/ShaneGH/react-analogue-time/releases/latest

### Use
```javascript
// javascript / typescript
import { TimePicker } from 'react-analogue-time'

// react stateless component
function Time () {
    // The TimePicker accepts all of the same props as an <input />
    <TimePicker onTimeChanged={(hour, minute) => alert(`${hour}:${minute}`)} className="my-class" />
}
```