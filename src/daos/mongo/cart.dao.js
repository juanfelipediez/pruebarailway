
import { cartModel } from "../../models/cart.model.js"

export class CartDao {
    async create() {
        return await cartModel.create({})
    }


    async getAll(){
        return await cartModel.find()
    }

    async getById(cid){
        return await cartModel.findById(cid)
    }
    
    async getByIdAndUpdate(cid, cart){
         return await cartModel.findByIdAndUpdate(cid, {
            $set: {
                includedProducts: cart
            }
        })
    }

    async getByIdAndPopulate(cid){
        return await cartModel.findOne({_id: cid}).populate('includedProducts.product')
    }


    async delete(cid){
        return await cartModel.findByIdAndDelete(cid)
    }
}



