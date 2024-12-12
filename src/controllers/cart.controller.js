import { productService, cartService, ticketService, userService, mailService } from "../services/index.js"
import { v4 as uuidv4 } from "uuid";
import CustomError from "../utils/errors/CustomError.js"
import errors from "../utils/errors/errors.js"

class CartController {
    async createCart(req, res, next) {
        try{
            const newCart = await cartService.create()
            res.status(201).json({
                response: newCart,
                message: 'A new cart was created'
            })
        }catch(error){
            return next(error)
        }
    }

    async getCart(req, res, next){
        try{
        const { cid } = req.params
            const cart = await cartService.getByIdAndPopulate(cid)

            if(!cart){
                CustomError.newError(errors.error)
                return
            }
            
            res.status(200).json({
                response: cart
            })
    
        }catch(error){
            return next(error)
        }
    }

    async addProductToCart(req, res, next) {
        try{
            const { pid } = req.params
            const user = await userService.getByEmail({email: req.user.user.email})
            const cart = await cartService.getById(user.cart)
            const product = await productService.getById(pid)
            if (!product) {
                CustomError.newError(errors.notFound)
            }
            const alreadyIncludedProduct = cart.includedProducts.find((el) => el.product.toString() === pid)
            if(alreadyIncludedProduct){
                alreadyIncludedProduct.quantity++
                await cartService.update(cart._id, cart.includedProducts)
                res.status(200).json({
                    response: product,
                    message: 'One item of the product was added to the cart'
                })
            }else{
                cart.includedProducts.push({product: pid, quantity: 1})
                await cartService.update(cart._id, cart.includedProducts)
                res.status(200).json({
                    response: product,
                    message: 'The product was added to the cart'
                })
            }
        } catch(error){
            return next(error)
        }
    }

    async editProductQuantity(req, res, next) {
        try{
            const { cid, pid } = req.params
            const {quantity} = req.body
            const cart = await cartService.getById(cid)
            const product = await productService.getById(pid)
            const includedProduct = cart.includedProducts.find( el => el.product == pid)
            includedProduct.quantity = quantity
            if (!product || !cart) {
                CustomError.newError(errors.notFound)
            }

            await cartService.update(cid, cart.includedProducts)

    
            res.status(200).json({
                message: 'The product quantity was successfuly edited'
            })
        }catch(error){
            return next(error)
        }
    }

    async editWholeCart(req, res, next) {
        try {    
            const { cid } = req.params;
            const { includedProducts } = req.body;
            
            const cart = await cartService.getById(cid);
            if (!cart) {
                CustomError.newError(errors.notFound)
            }
            await cartService.update(cid, includedProducts)
    
            res.status(200).json({
                message: 'The content of this cart was updated.'
            });
        } catch (error) {
            return next(error)
        }    
    }

    async emptyCart(req, res, next){
        try{
            const {cid} = req.params
            const cart = await cartService.getById(cid)
            if(!cart){
                CustomError.newError(errors.notFound)
            }
            await cartService.update(cid, [])
    
            res.status(200).json({
                message: 'The cart is now empty.'
            })
        }catch(error){
            return next(error)
        }
    }

    async deleteProductFromCart(req, res, next){
        try{
            const user = await userService.getByEmail({email: req.user.user.email})        
            const cart = await cartService.getById(user.cart)    
            const {pid} = req.params
            const product = await productService.getById(pid)
            if (!product || !cart) {
                CustomError.newError(errors.notFound)
            }
    
            const includedProduct = cart.includedProducts.find((el) => el.product == pid)
            cart.includedProducts.splice(cart.includedProducts.indexOf(includedProduct), 1)
            await cartService.update(cart._id, cart.includedProducts)
            res.status(200).json({
                message: 'The product has been deleted.'
            })
        }catch(error){
            return next(error)
        }
    }

    async makePurchase(req, res, next){
        try{
            const user = await userService.getByEmail({email: req.user.user.email})        
            const cart = await cartService.getByIdAndPopulate(user.cart)
            const availableProducts = cart.includedProducts.filter( (el) => el.quantity <= el.product.stock)
            cart.includedProducts = cart.includedProducts.filter( (el) => el.quantity > el.product.stock)
            const amount = availableProducts.reduce((partialAmount, el) => partialAmount + (el.product.price * el.quantity), 0)
            await cartService.update(cart._id, cart.includedProducts)
            const newTicket = await ticketService.create({
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: amount,
                purchaser: user.email,
            })
                        
            for (const availableProduct of availableProducts) {
                await productService.update(
                { _id: availableProduct.product._id },         
                { $inc: {stock: - availableProduct.quantity}}  
                );
            }

            const noProcesedProducts = []
            
            cart.includedProducts.forEach(el => noProcesedProducts.push({ 
                    product: el.product.title,
                    id: el.product._id,
                })
            )

            await mailService.sendMail({
                to: user.email,
                subject: "Purchase details",
                html: `<h1>Purchase details:</h1><p>${newTicket}</p><h1>Excluded products:</h1><p>${noProcesedProducts}</p>`,
            })

            res.status(200).json({
                ticket: newTicket, 
                products_without_stock: noProcesedProducts})
        }catch(error){
            return next(error)
        }
    }
}



export const cartController = new CartController
