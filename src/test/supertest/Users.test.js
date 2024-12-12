import { expect } from "chai";
import supertest from "supertest";
import env from "../../config/config.js"
import { userService } from '../../services/index.js';



const requester = supertest(`http://localhost:${env.PORT}/api/sessions`)

describe(
    "Testing user/session endpoints",
    ()=> {
        let user
        const data = {
            first_name: 'Julian',
            last_name: 'Sanchez',
            email: 'juliansanchez@fakeemail.com',
            age: "18",
            password: 'fakepassword',
        }
        before(
            async()=>{
            }
        )

        after(
            async ()=> {
                await userService.delete(user._id);
            }
        )
        
        it("User creates successfully", async () => {
            const response = await requester.post("/register").send(data); 
            const { body, statusCode } = response;
            user = body.response
            expect(statusCode).to.be.equals(201); 
        });

        it("Don't allow multiple users with the same email direction", async () => {
            const response = await requester.post("/register").send(data);        
            const { body, statusCode } = response;
            expect(statusCode).to.be.equals(302); 
        });

        it(
            "Correct log in",
            async ()=> {
                const response = await requester.post("/login").send(data)
                const { statusCode } = response
                expect(statusCode).to.be.equals(200)
            }
        )
        
        it("Password is correctly hashed", async () => {
            const {password} = data
            const hashedPassword = user.password

            expect(hashedPassword).not.be.equals(password); 
        });


        it("Current endpoint sends user information", async () => {
            const loginResponse = await requester.post("/login").send(data);
            const cookies = loginResponse.headers['set-cookie']
        
            const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));

            const token = tokenCookie.split(';')[0]; 

            const response = await requester.get("/current").set("Cookie", token);
            const { statusCode, body } = response;

            expect(statusCode).to.be.equal(200);
            expect(body.data.user.email).to.be.equal(user.email)
        });

        it("Login error endpoint send 401 error", async () => {
            const response = await requester.get("/login-error");       
            const { statusCode } = response
            expect(statusCode).to.be.equal(401)      
        });
    }
)









