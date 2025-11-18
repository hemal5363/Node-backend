import { Router } from "express";

import { authorization } from "../controllers/authController";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/productsController";
import { USER_ROLES } from "../utils/constant";

const router = Router();

router.get("/", getAllProducts);
router.post("/", authorization([USER_ROLES.ADMIN]), createProduct);
router.patch("/:id", authorization([USER_ROLES.ADMIN]), updateProduct);
router.delete("/:id", authorization([USER_ROLES.ADMIN]), deleteProduct);

export default router;
