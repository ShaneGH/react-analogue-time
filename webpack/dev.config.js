const merge = require("webpack-merge");
const base = require("./base.config");

module.exports = merge(base, {
    entry: {
        "./dist/react-analogue-time": "./src/timePicker.tsx"
    },

    mode: "development",

    optimization: {
        minimize: false
    }
});