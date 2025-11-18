import { Router } from "express";

import {
  deleteUserDetails,
  getUserDetails,
  updateUserDetails,
  updateUserPassword,
} from "../controllers/meUserController";

const router = Router();

router.get("/", getUserDetails);
router.patch("/", updateUserDetails);
router.delete("/", deleteUserDetails);
router.patch("/update-password", updateUserPassword);

export default router;
