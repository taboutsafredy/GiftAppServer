// Path: src/app/middlewares.ts

import express, { Application } from "express";
import cors from "cors";
import { corsOptions, profilePhotoDir } from "./config";

import { defaultErrorMiddleware, authMiddleware } from "../middleware/authMiddleware";

export const setupMiddlewares = (app: Application) => {
  app.use('/pfps', express.static(profilePhotoDir));
  app.use(cors(corsOptions));
  app.use(express.json());

  // Auth 🔑
  app.use(authMiddleware);

  // Error 🚨
  app.use(defaultErrorMiddleware);
};