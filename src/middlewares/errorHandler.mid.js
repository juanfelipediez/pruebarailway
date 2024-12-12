import winstonLogger from "../utils/winston.util.js";
import errors from "../utils/errors/errors.js";

const errorHandler = (error, req, res, next) => {
    if(error.statusCode){
        winstonLogger.error(error.message)
        console.log(error)
    }else{
        winstonLogger.fatal(error.message)
        console.log(error)
    }
    return res.status(error.statusCode || errors.fatal.statusCode).json({message: error.message || error.fatal.message})
}

export default errorHandler