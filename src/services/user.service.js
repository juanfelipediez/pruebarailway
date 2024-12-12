export class UserService {
    constructor(dao) {
      this.dao = dao;
    }
    async create(data){
      return await this.dao.create(data);
    }

    async delete(id){
      return await this.dao.delete(id);
    }

    async update(id, data){
      return await this.dao.update( id, data )
    }

    async findOne(property){
      return await this.dao.findOne(property);
    }

    async findById(id){
      return await this.dao.findById(id);
    }    
    
    async getByEmail(data) {
        return await this.dao.getByEmail(data);
      }
  }