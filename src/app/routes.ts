// Path: src/app/routes.ts

import { Application } from "express";
import giftRoutes from "../routes/giftRoutes";
import userRoutes from "../routes/userRoutes";
import leaderboardRoutes from "../routes/leaderboardRoutes";
import webhook from "../routes/webhookRoutes";

export const setupRoutes = (app: Application) => {
  app.use('/gifts', giftRoutes);
  app.use('/users', userRoutes);
  app.use('/leaderboard', leaderboardRoutes);
  app.use('/webhook', webhook);
};