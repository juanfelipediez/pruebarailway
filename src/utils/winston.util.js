import {createLogger, transports, addColors, format} from "winston"
const {colorize, simple} = format

const{Console, File} = transports

const levels = {fatal: 0, error: 1, info: 2, http: 3}

const colors = {fatal: "red", error: "yellow", info: "blue", http: "white"} 
addColors(colors)

const winstonLogger = createLogger({
    levels,
    format: colorize(),
    transports: [
        new Console({level: "http", format: simple()}),
        new File({ level: "error", format: simple(), filename: "./src/utils/errors/errors.log" })
    ]
})

export default winstonLogger