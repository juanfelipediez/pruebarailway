import nodemailer from "nodemailer";
import  env  from "../config/config.js";
import winstonLogger from "../utils/winston.util.js"


export class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env.mailer.host,
            port: env.mailer.port,
            auth: env.mailer.auth,
        });
        this.from = "emi@gmail.com";
    }


    async sendMail({ to, subject, html }) {
        try {
            const result = await this.transporter.sendMail({
                from: this.from,
                to,
                subject,
                html,
                attachments: [],
            });
            winstonLogger.info(result);
        }   catch (error) {
            winstonLogger.error(error);
        }
    }
}
