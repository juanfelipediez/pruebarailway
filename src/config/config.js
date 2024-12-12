import {config} from "dotenv"
import args from "../utils/args.util.js"
const {m} = args

let path
switch (m) {
    case "prod":
        path = "./.env"
        break;
    case "dev":
        path = "./.env.dev"
        break;
    case "chai-test":
        path = "./.env.test"
        break;
    case "supertest":
        path = "./.env.test"
        break;        
    }

config({path})
export default {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    PERSISTANCE: "mongo",
    mailer: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    }
}



