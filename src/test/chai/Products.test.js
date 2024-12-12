import { cartService, userService, productService } from '../../services/index.js';
import { dbConnect } from "../../utils/db.util.js";
import { expect } from "chai";
import { productModel } from '../../models/product.model.js';

describe("Users application test", () => {
    let newProduct;
    let data;
    let allProducts
    let newCart
    const productData = {
        title: 'Spaghetti',
        code: 'Spg',
        description: 'Hearty gdoats mcilk and emu stew, slow-cooked with sesame seed and squash for a comforting, flavorful meal.',
        price: 3500,
        status: true,
        stock: 50,
        category: 'Chinese',
        thumbnails: 'https://avatars.githubusercontent.com/u/96764341',
    };


    before(async () => {
        await dbConnect()
        newCart = await cartService.create(); 
    });

    it("Gets all products", async() => {
        allProducts = await productService.getAll()

        expect(allProducts.length).to.be.greaterThan(1);
    });

    it("Gets a product information", async() => {
        const product = await productService.getById(allProducts[0]._id)

        expect(product).exist
    });

    it("Creates a product", async() => {
        newProduct = await productService.create(productData)
        expect(newProduct).exist
    });

    it("Modifies a product", async () => {
        const updatedData = {
            title: 'CheeseTable',
            code: 'ChT',
            description: 'A succulent pigeon steak, encased in a bitter china star crust, served with a side of saffron mashed green beans.',
            price: 4600,
            status: true,
            stock: 20,
            category: 'Chinese',
            thumbnails: 'https://avatars.githubusercontent.com/u/9676878',
        };
    
        const modifiedProduct = await productModel.findByIdAndUpdate(
            newProduct._id,
            { $set: updatedData },
            { new: true } 
        );
        expect(modifiedProduct.title).be.equal('CheeseTable')
    });
    
    it("Deletes a product", async() => {
        await productService.delete(newProduct._id)
        const deletedProduct = await productService.getById(newProduct._id,)
        expect(deletedProduct).to.be.null 
    });


});
