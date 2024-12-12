import {userModel} from "../../models/user.model.js"

export class UserDao{

    async create(data){
      return await userModel.create(data);
    }
  
    async delete(id){
      return await userModel.findByIdAndDelete(id);
    }

    async update(id, data){
      return await userModel.findByIdAndUpdate(id, data)
    }
  
    async findOne(property){
      return await userModel.findOne(property);
    }
  
    async findById(id){
      return await userModel.findById(id);
    }

    async getByEmail(data){
        return await userModel.findOne(data)
    }
}