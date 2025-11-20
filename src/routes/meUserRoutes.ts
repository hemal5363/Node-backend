import { Router } from "express";

import fileUpload from "../config/multer";
import {
  deleteUserDetails,
  getUserDetails,
  updateUserDetails,
  updateUserPassword,
} from "../controllers/meUserController";

const router = Router();

router.get("/", getUserDetails);
router.patch("/", fileUpload.single("profileImage"), updateUserDetails);
router.delete("/", deleteUserDetails);
router.patch("/update-password", updateUserPassword);

export default router;
