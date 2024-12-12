import { cartService, userService, productService } from '../../services/index.js';
import { dbConnect } from "../../utils/db.util.js";
import { expect } from "chai";

describe("Carts application test", () => {
    let newProduct;
    let data;
    let cart

    before(async () => {
        await dbConnect()

        data = {
            title: 'Pizza napolitana',
            code: 'S sPdxaesdsdxsscdss',
            description: 'Hearty gdoats mcilk and emu stew, slow-cooked with sesame seed and squash for a comforting, flavorful meal.',
            price: 3500,
            status: true,
            stock: 50,
            category: 'Chinese',
            thumbnails: 'https://avatars.githubusercontent.com/u/96764341',
        };
        newProduct = await productService.create(data); 
    });
    
    it("Cart successfully created", 
        async () => {
            const newCart = await cartService.create(); 
            cart = newCart
            expect(newCart).to.have.property("_id"); 
        }
    );

    it("Cart content an empty array",
        () => {
            expect(cart.includedProducts).to.be.deep.equal([])
        }
    )

    
    it("Returns all carts",
        async ()=> {
            await cartService.create()
            const allCarts = await cartService.getAll()
            expect(allCarts.length).to.be.greaterThan(2)
        }
    )
    

    it("Deletes a cart",
        async ()=> {
            await cartService.delete(cart._id)
            await productService.delete(newProduct._id)
            const newCart = await cartService.getById(cart._id)
            expect(newCart).not.exist
        }
    )
});