// Path: src/routes/userRoutes.ts

import { Router } from "express";
import * as userController from "../controllers/userController";
import { asyncHandler } from "../utils/asyncHandler";
const router = Router();

router.post("/create", asyncHandler(userController.createUser));
router.get("/:id", asyncHandler(userController.getUser));
router.get("/:id/rank", asyncHandler(userController.getRank));
router.get("/:id/transaction", asyncHandler(userController.getRecentActions));

export default router;