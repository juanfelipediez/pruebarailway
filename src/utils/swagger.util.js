import __dirname from "../dirname.js";

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Online food store",
            description: "Online food store documentation"
        }
    },
    apis: [`${__dirname}/docs/*.yaml`]
}

export default swaggerOptions;