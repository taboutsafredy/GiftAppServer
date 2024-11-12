// Path: src/app.ts

import express from "express";
import { PORT } from "./app/config";
import { connectToDatabase } from "./app/database";
import { setupMiddlewares } from "./app/middlewares";
import { setupRoutes } from "./app/routes";

const app = express();

setupMiddlewares(app);
setupRoutes(app);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Everything is going well on: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("It's not good :|.", error);
  });