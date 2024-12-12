import { mongoDao } from "./mongo/index.js"
import { memoryDao } from "./memory/index.js"
import  env  from "../config/config.js"
import { connect } from "mongoose"
import winstonLogger from "../utils/winston.util.js"

const createDao = () => {
    switch(env.PERSISTANCE){
        case "mongo":
            connect(env.MONGO_URI)
            .then(() => winstonLogger.info("MongoDB connected"))
            .catch((error) => winstonLogger.info(error));

            return {
                productDao: new mongoDao.productDao(),
                cartDao: new mongoDao.cartDao(),
                ticketDao: new mongoDao.ticketDao(),
                userDao: new mongoDao.userDao()
            }
        case "memory":
            return{
                productDao: new memoryDao.productDao(),
                cartDao: new memoryDao.cartDao(),
                ticketDao: new memoryDao.ticketDao(),
                userDao: new memoryDao.userDao()
            }
    }
}

export const {productDao, cartDao, ticketDao, userDao} = createDao()