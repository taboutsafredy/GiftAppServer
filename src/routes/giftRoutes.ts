// Path: src/routes/giftRoutes.ts

import { Router } from 'express';
import * as giftController from '../controllers/giftController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get("/", asyncHandler(giftController.getAllGifts));
router.get("/availableToBeSend/:userid", asyncHandler(giftController.getGiftsAvailableToBeSend));
router.get("/receivedByUser/:userid", asyncHandler(giftController.getGiftsReceivedByUser));
router.get("/recentTransaction", asyncHandler(giftController.getGiftRecentTransaction));
router.post("/purchase", asyncHandler(giftController.purchaseGift));
router.get("/purchase/success/:successId", asyncHandler(giftController.purchaseSuccess));
router.patch("/receive", asyncHandler(giftController.receiveGift));

export default router;