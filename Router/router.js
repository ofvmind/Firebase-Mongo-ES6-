import express from "express";
import { body } from "express-validator";
import userController from "../Controllers/UserController.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../Controllers/productController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

//mongodb routes
router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({min: 4, max: 32}),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users",authMiddleware(['ADMIN']), userController.getUsers);

//firebase routes
router.get("/", authMiddleware("ADMIN"), getProducts);
router.post("/new", createProduct);
router.get("/product/:id", getProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
