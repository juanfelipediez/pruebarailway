import { userModel } from "../models/user.model.js";
import { cartService } from '../services/index.js';
import { faker } from "@faker-js/faker";
import {createHash } from '../utils/hashFunctions.js';


const createFakeUser = async (req, res, next) => {
    const {n} = req.params
    let newUsers = []
    for(let i=1; i<=n; i++){
        try{        
            const newCart = await cartService.create()
            const first_name = faker.person.firstName().toLowerCase();
            const last_name = faker.person.lastName().toLowerCase();
            const newUser = await userModel.create({
                first_name,
                last_name,
                email: `${first_name[0]}${last_name}@ecommerce.com`,
                age: faker.date.birthdate({ mode: 'age', min: 18, max: 65 }),
                password: createHash(faker.internet.password({ length: 20 })),
                cart: newCart._id
            })
            newUsers.push(newUser)
        }catch(error){
            return next(error)
        }
    }
    return res.status(201).json({
        response: newUsers,
        message: "New fake user/s created"
    })
}



export {createFakeUser}