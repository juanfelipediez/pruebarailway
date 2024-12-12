import {connect} from "mongoose"
import env from "../config/config.js"
import winstonLogger from "../utils/winston.util.js"


export async function dbConnect(){
    try{
        await connect(env.MONGO_URI)
        winstonLogger.info('DB connected!')
    }catch(error){
        winstonLogger.info(error)
    }
}