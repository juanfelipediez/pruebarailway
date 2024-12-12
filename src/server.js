import express from "express"
import __dirname from "./dirname.js"
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import initializePassport from "./config/passport.config.js"
import passport from 'passport'
import routes from "./routes/index.js"
import env from "./config/config.js"
import args from "./utils/args.util.js"
import { dbConnect } from "./utils/db.util.js"
import winston from "./middlewares/winstonLogger.mid.js"
import errorHandler from "./middlewares/errorHandler.mid.js"
import winstonLogger from "./utils/winston.util.js"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUiExpress from "swagger-ui-express"
import swaggerOptions from "./utils/swagger.util.js"


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
console.log(env)

app.use(cookieParser());
app.use(
  session({
    secret: "s3cr3t",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: env.MONGO_URI,
      ttl: 15,
    }),
  })
);
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


const specs = swaggerJSDoc(swaggerOptions)
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(express.static(__dirname+"/public"))
app.use(winston)
app.use("/api", routes)
app.use(errorHandler)

const httpServer = app.listen(env.PORT, () => {
  winstonLogger.info(`Server is running on port http://localhost:${env.PORT} as ${args.m}`);
})
dbConnect()

