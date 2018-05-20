const merge = require("webpack-merge");
const base = require("./base.config");

module.exports = merge(base, {
    entry: {
        "./dist/react-analogue-time.min": "./src/timePicker.tsx"
    },

    mode: "production"
});