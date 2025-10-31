import { Router } from "express";
import {
  register,
  deleteUser,
  getAllUsers,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:resetToken", resetPassword);

router.get("/", getAllUsers);
router.delete("/:id", deleteUser);

export default router;
