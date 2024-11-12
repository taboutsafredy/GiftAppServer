// Path: src/app/config.ts

import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const databaseAccess = process.env.MONGODB?.toString()!;
export const profilePhotoDir = path.join(__dirname, '../../pfps');

export const corsOptions = {
  origin: '*',
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
};