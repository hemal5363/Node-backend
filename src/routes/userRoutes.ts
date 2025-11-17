import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  updateUserPassword,
} from "../controllers/userController";
import { authorization } from "../controllers/authController";
import { USER_ROLES } from "../utils/constant";

const router = Router();

router.get("/", authorization([USER_ROLES.ADMIN]), getAllUsers);
router.post("/", authorization([USER_ROLES.ADMIN]), createUser);
router.patch("/:id", authorization([USER_ROLES.ADMIN]), updateUser);
router.delete("/:id", authorization([USER_ROLES.ADMIN]), deleteUser);
router.patch("/me/update-password", updateUserPassword);

export default router;
