import { expect } from "chai";
import supertest from "supertest";
import env from "../../config/config.js"
import { userService, productService, cartService } from '../../services/index.js';


const requester = supertest(`http://localhost:${env.PORT}/api/mocks`)

describe(
    "Testing mock creation endpoints",
    ()=> {
        const productMockQuantity = 2
        const userMockQuantity = 2
        let productMocks = []
        let userMocks = []

        after(
            async ()=> {
                for(const productMock of productMocks){
                    await productService.delete(productMock._id)
                }   
                for(const userMock of userMocks){
                    await userService.delete(userMock._id)
                    await cartService.delete(userMock.cart)
                }   
            }
        )
        
        it("Creates product mocks", 
            async () => {
                const response = await requester.post(`/products/${productMockQuantity}`)   
                const { body, statusCode } = response;
                productMocks = body.response
                expect(statusCode).to.be.equals(201); 
            }
        );

        it("Creates user mocks", 
            async () => {
                const response = await requester.post(`/users/${userMockQuantity}`)   
                const { body, statusCode } = response;
                userMocks = body.response
                expect(statusCode).to.be.equals(201); 
            }
        );
    }
)



