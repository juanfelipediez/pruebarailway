import { expect } from "chai";
import supertest from "supertest";
import env from "../../config/config.js"
import { cartService, productService, userService } from '../../services/index.js';

const requester = supertest(`http://localhost:${env.PORT}/api/carts`)
const sessionRequester = supertest(`http://localhost:${env.PORT}/api/sessions`)

describe(
    "Testing cart endpoints",
    () => {
        let newCart
        let newUser
        let newProduct
        let token

        let userData = {
            first_name: 'Artemio',
            last_name: 'Gimenez',
            email: 'artemiogimenez@fakeemail.com',
            age: "18",
            password: 'fakepassword',
        }

        let productData = {
            title: 'Pizza mozzarela',
            code: 'pizmozz',
            description: 'Hearty gdoats mcilk and emu stew, slow-cooked with sesame seed and squash for a comforting, flavorful meal.',
            price: 3500,
            status: true,
            stock: 50,
            category: 'Chinese',
            thumbnails: 'https://avatars.githubusercontent.com/u/96764341',
        };

        before(
            async () => {
                newProduct = await productService.create(productData);

                const registerResponse = await sessionRequester.post("/register").send(userData);
                newUser = registerResponse.body.response

                const loginResponse = await sessionRequester.post('/login').send(userData)
                const cookies = loginResponse.headers['set-cookie']
                const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
                token = tokenCookie.split(';')[0];
            }
        )

        after(
            async () => {
                await productService.delete(newProduct._id)
                await userService.delete(newUser._id)
                await cartService.delete(newCart._id)
                await cartService.delete(newUser.cart)
            }
        )

        it("Cart successfully created", async () => {
            const response = await requester.post("/");
            const { body, statusCode } = response;
            newCart = body.response
            expect(statusCode).to.be.equals(201);
        });

        it("Get cart information", async () => {
            const response = await requester.get(`/${newCart._id}`);
            const { body, statusCode } = response;
            const cart = body.response
            expect(statusCode).to.be.equals(200);
            expect(cart._id).to.be.equal(newCart._id)
        });

        it('Adds a product to the cart',
            async () => {
                const response = await requester.post(`/product/${newProduct._id}`).set("Cookie", token);
                const { statusCode } = response;
                expect(statusCode).to.be.equals(200);

                const cart = await cartService.getById(newUser.cart)

                expect(cart.includedProducts[0].product).to.be.deep.equal(newProduct._id)
            }
        )

        it('Delete a product from the cart',
            async () => {
                const response = await requester.delete(`/product/${newProduct._id}`).set("Cookie", token);
                const { statusCode } = response
                const cart = await cartService.getById(newUser.cart)

                await requester.post(`/product/${newProduct._id}`).set("Cookie", token);
                expect(statusCode).to.be.equal(200)
            }
        )

        it('Edit quantity of a product',
            async () => {
                const previousCart = await cartService.getById(newUser.cart)
                const previousQuantity = previousCart.includedProducts[0].quantity
                console.log(`previousQuantity: ${previousQuantity}`)
                const response = await requester.put(`/${previousCart._id}/product/${newProduct._id}`).send({ quantity: 5 })
                const { statusCode } = response
                expect(statusCode).to.be.equal(200)

                const modifiedCart = await cartService.getById(newUser.cart)
                const modifiedQuantity = modifiedCart.includedProducts[0].quantity
                console.log(`modifiedQuantity: ${modifiedQuantity}`)
                expect(previousQuantity).not.be.equals(modifiedQuantity)
            })

        it('Modifies whole cart',
            async () => {
                const previousCart = await cartService.getById(newUser.cart)
                const previousIncludedProduct = previousCart.includedProducts[0]._id

                const response = await requester.put(`/${newUser.cart}`).send({
                    includedProducts: [
                        { product: "66821d8be7e12918a21ab30b", "quantity": 22 },
                        { product: "6681e39cfe5467bc0e684f80", "quantity": 44 }
                    ]
                })
                const { statusCode } = response

                const modifiedCart = await cartService.getById(newUser.cart)
                const newIncludedProduct = modifiedCart.includedProducts[0]._id
                expect(statusCode).to.be.equal(200)
                expect(previousIncludedProduct).not.be.equals(newIncludedProduct)
            }
        )

        it('Empty cart',
            async () => {
                const previousCart = await cartService.getById(newUser.cart)
                expect(previousCart.includedProducts).not.be.deep.equals([])

                const response = await requester.delete(`/${newUser.cart}`).set("Cookie", token);
                const { statusCode } = response
                expect(statusCode).to.be.equal(200)

                const modifiedCart = await cartService.getById(newUser.cart)
                expect(modifiedCart.includedProducts).to.be.deep.equals([])
            }
        )
    }
)