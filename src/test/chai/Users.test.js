import { cartService, userService } from '../../services/index.js';
import { dbConnect } from "../../utils/db.util.js";
import { expect } from "chai";

describe("Users application test", () => {
    let newCart;
    let data;
    let uid


    before(async () => {
        await dbConnect()

        newCart = await cartService.create(); 
        data = {
            first_name: 'Artemio',
            last_name: 'Gimenez',
            email: 'artemiogimenez@fakeemail.com',
            age: 18,
            password: 'fakepassword',
            cart: newCart._id,
        };
    });

    it("Email direction is received", () => {
        expect(data).to.have.property("email");
    });

    
    it("User successfully created", 
        async () => {
            const newUser = await userService.create(data); 
            uid = newUser._id
            expect(newUser).to.have.property("_id"); 
        }
    );

    it("Don't allow duplicated email users",
        async() => {
            try{
                const newUser = await userService.create(data); 
                expect(newUser).not.exist 
            }catch(error){}
        }
    )
    

    it("User successfully deleted", 
        async () => {
            await userService.delete(uid); 
            const user = await userService.findById(uid)
            expect(user).not.exist
        }
    );


});
