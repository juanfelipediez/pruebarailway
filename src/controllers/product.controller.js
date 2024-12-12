import { productService } from "../services/index.js"
import { faker } from "@faker-js/faker";
import winstonLogger from "../utils/winston.util.js";
import CustomError from "../utils/errors/CustomError.js"
import errors from "../utils/errors/errors.js"

class ProductController {
    async getProduct(req, res, next){
        try{        
            const products = await productService.getAll()
            if(products.length < 1){
                res.status(200).json(
                    {
                        response: products,
                        message: "There are not products yet"
                    }
                )
                return
            }
            res.status(200).json(
                {
                    response: products,
                    message: "Product list"
                }
            )
    
        }catch(error){
            return next(error)
        }
    
    }

    async getProductById(req, res, next){
        try{        
            const { pid } = req.params
            const product = await productService.getById(pid)
    
        
            if(!product){
                CustomError.newError(errors.noResults)
                return
            }
            res.status(200).json(
                {
                    response: product,
                    message: "Product information"
                }
            )
        }catch(error){
            return next(error)
        }
    
    }

    async createProduct(req, res, next){
        try{
            const {title, description, code, price, status, stock, category, thumbnails} = req.body

            if(!title || !description || !code || !price || !stock || !category || !status){
                CustomError.newError(errors.error)
                return
            }
        
            const newProduct = {
                title: title,
                code: code,
                description: description,
                price: price,
                status: status,
                stock: stock,
                category: category,
                thumbnails: thumbnails,
            }
            const product = await productService.create(newProduct)
            
            res.status(201).json(
                {
                    response: product,
                    message: "The product was successfully created"
                }
            )
    
        }catch(error){
            return next(error)
        }
    
    }

    async editProduct(req, res, next){
        try{
            const {title, description, code, price, status, stock, category, thumbnails} = req.body
            const { pid } = req.params
    
            
            const product = await productService.update(pid, {$set: req.body})
            if(!product){
                CustomError.newError(errors.error)
                return
            }
            
            winstonLogger.info(`The product ${title} was successfully edited.`)
        res.status(200).json(
            {
                response: product,
                message: "The product was successfully edited."
            }
        )
    
        }catch(error){
            return next(error)
        }
    
    }

    async deleteProduct(req, res, next){
        try{
            const { pid } = req.params
    
            
            const product = await productService.getById(pid)
            if(!product){
                CustomError.newError(errors.error)
                return
            }
            await productService.delete(pid)
    
        res.status(200).json(
            {
                response: product,
                message: "The product was successfully deleted."
            }
        )
    
        }catch(error){
            return next(error)
        }
    }

    async createFakeProduct(req, res, next){

        const {n} = req.params
        let newProducts = []
        for(let i=1; i <= n; i++){
            const title = faker.food.dish() + " " + faker.string.alpha(4)
            const description = faker.food.description()
            const newProduct = {
                title: title,
                code: faker.string.alpha(10),
                description: description,
                price: faker.commerce.price({ min: 1000, max: 12000, dec: 0 }),
                status: true,
                stock: faker.number.int({ max: 100 }),
                category: faker.food.ethnicCategory(),
                thumbnails: faker.image.avatar(),
            }       
            try{
                const product = await productService.create(newProduct)
                winstonLogger.info(`New product created: ${product.title}`)
                newProducts.push(product)
                
            }catch(error){
                return next(error)
            }
        }
        res.status(201).json({
            response: newProducts,
            message: 'New products have been successfully created.'
        })        
    }
}

export const productController = new ProductController

