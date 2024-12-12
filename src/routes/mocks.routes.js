import { Router } from "express";
import { createFakeUser } from "../controllers/user.controller.js";
import { productController } from "../controllers/product.controller.js";
const router = Router()

router.use("/users/:n", createFakeUser)
router.use("/products/:n", productController.createFakeProduct)

export default router