import winstonLogger from "../utils/winston.util.js";

function winston(req, res, next) {
    try {
        req.logger = winstonLogger
        const message = `${req.method} ${req.url}`
        req.logger.http(message)
        return next()
    } catch (error) {
        return next(error)
    }
}

export default winston