// Path: src/app/database.ts

import mongoose from "mongoose";
import { databaseAccess } from "./config";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(databaseAccess);
    console.log("Cool, now I think that you're connected ;)");
  } catch (error) {
    console.error("Something happened and it's not well :|", error);
    throw error;
  }
};