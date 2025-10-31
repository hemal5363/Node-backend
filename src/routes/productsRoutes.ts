import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/productsController";
import { authorization } from "../controllers/authController";

const router = Router();

router.get("/", getAllProducts);
router.post("/", authorization(["admin"]), createProduct);
router.patch("/:id", authorization(["admin"]), updateProduct);
router.delete("/:id", authorization(["admin"]), deleteProduct);

export default router;
