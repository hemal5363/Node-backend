import { Router } from "express";

import {
  register,
  loginUser,
  forgotPassword,
  resetPassword,
  googleRegister,
  googleLogin,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:resetToken", resetPassword);

router.post("/google/register", googleRegister);
router.post("/google/login", googleLogin);

export default router;
