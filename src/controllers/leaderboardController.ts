// Path: src/controllers/leaderboardController.ts

import { Request, Response } from "express";
import * as leaderboardService from "../services/leaderboardService";


// the top 100 users who received the most gifts, including their rank and profile details.
export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const leaderboard = await leaderboardService.getTopUsersByGiftsReceived();
        res.json(leaderboard);
    } catch (error: any) {
        console.error("Error getting leaderboard:", error.message);
        return res.status(500).json({ error: "An error occurred while getting the leaderboard." });
    }
};