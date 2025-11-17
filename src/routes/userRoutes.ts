import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  updateUserPassword,
} from "../controllers/userController";
import { authorization } from "../controllers/authController";

const router = Router();

router.get("/", authorization(["admin"]), getAllUsers);
router.post("/", authorization(["admin"]), createUser);
router.patch("/:id", authorization(["admin"]), updateUser);
router.delete("/:id", authorization(["admin"]), deleteUser);
router.patch("/me/update-password", updateUserPassword);

export default router;
