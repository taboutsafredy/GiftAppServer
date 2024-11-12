// Path: src/routes/leaderboardRoutes.ts

import { Router } from 'express';
import * as leaderboardController from '../controllers/leaderboardController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get("/top", asyncHandler(leaderboardController.getLeaderboard));

export default router;