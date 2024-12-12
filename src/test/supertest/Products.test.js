import { expect } from "chai";
import supertest from "supertest";
import env from "../../config/config.js"
import { userService, cartService} from '../../services/index.js';

const requester = supertest(`http://localhost:${env.PORT}/api/products`)
const sessionRequester = supertest(`http://localhost:${env.PORT}/api/sessions`)

describe(
    "Testing product endpoints",
    ()=> {
        let token
        let newUser
        let newProduct
        let allProducts
        const userData = {
            first_name: 'Gabriel',
            last_name: 'Garcia',
            email: 'gabrielgarcia@fakeemail.com',
            age: "18",
            password: 'fakepassword',
        }

        const productData = {
            title: 'Spinach spaguettis',
            code: 'spinspa',
            description: 'Hearty gdoats mcilk and emu stew, slow-cooked with sesame seed and squash for a comforting, flavorful meal.',
            price: 3500,
            status: true,
            stock: 50,
            category: 'Chinese',
            thumbnails: 'https://avatars.githubusercontent.com/u/96764341',
        }
        before(
            async()=>{
                const response = await sessionRequester.post('/register').send(userData)
                const {body, statusCode} = response
                newUser = response.body.response

                await userService.update(newUser._id, {$set: {role: 'admin'}})

                const loginResponse = await sessionRequester.post('/login').send(userData)
                const cookies = loginResponse.headers['set-cookie']
                const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
                token = tokenCookie.split(';')[0]; 
            }    
        )

        after(
            async()=>{
                await userService.delete(newUser._id)
                await cartService.delete(newUser.cart)
            }
        )

        it('Creates a product',
            async()=>{
                const response = await requester.post('/').set("Cookie", token).send(productData)
                const {body, statusCode} = response
                newProduct = body.response
                expect(statusCode).to.be.equal(201)
            }
        )
        it('Gets all products information',
            async()=>{
                const response = await requester.get('/')
                const {body, statusCode} = response
                allProducts = body.response
                expect(statusCode).to.be.equal(200)
            }
        )


        it('Gets single product information',
            async()=>{
                const product = allProducts[0]
                const response = await requester.get(`/${product._id}`)
                const {body, statusCode} = response
                expect(statusCode).to.be.equal(200)
                }
        )
        
        it('Edits a product',
            async()=>{
                const response = await requester.put(`/${newProduct._id}`).set("Cookie", token).send({
                    title: 'CheeseTable',
                    code: 'ChT',
                    description: 'A succulent pigeon steak, encased in a bitter china star crust, served with a side of saffron mashed green beans.',
                    price: 4600,
                    status: true,
                    stock: 20,
                    category: 'Chinese',
                    thumbnails: 'https://avatars.githubusercontent.com/u/9676878',        
                })
                const {body, statusCode} = response
                expect(statusCode).to.be.equal(200)
            }
        )

        it('Deletes a product',
            async()=>{
                const response = await requester.delete(`/${newProduct._id}`).set("Cookie", token)
                const {body, statusCode} = response
                expect(statusCode).to.be.equal(200)
                }
        )
    }
)









