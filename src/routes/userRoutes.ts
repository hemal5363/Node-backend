import { Router } from "express";

import fileUpload from "../config/multer";
import { authorization } from "../controllers/authController";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/userController";
import { USER_ROLES } from "../utils/constant";

const router = Router();

router.get("/", authorization([USER_ROLES.ADMIN]), getAllUsers);
router.post(
  "/",
  authorization([USER_ROLES.ADMIN]),
  fileUpload.single("profileImage"),
  createUser
);
router.patch(
  "/:id",
  authorization([USER_ROLES.ADMIN]),
  fileUpload.single("profileImage"),
  updateUser
);
router.delete("/:id", authorization([USER_ROLES.ADMIN]), deleteUser);

export default router;
