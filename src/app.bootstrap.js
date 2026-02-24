import express from "express";
import authRouter from "./Modules/Auth/auth.controller.js";
import notesRouter from "./Modules/Notes/notes.controller.js";

import { SERVER_PORT, NODE_ENV } from "../config/config.service.js";
import testDbConnection from "./DB/connection.js";

async function bootstrap() {
  const app = express();
  const port = SERVER_PORT;
  app.use(express.json());

  await testDbConnection();

  app.use("/auth", authRouter);
  app.use("/notes", notesRouter);

  app.use((error, req, res, next) => {
    return NODE_ENV == "dev"
      ? res
          .status(error.cause?.statusCode ?? 500)
          .json({ errMsg: error.message, error, stack: error.stack })
      : res
          .status(error.cause?.statusCode ?? 500)
          .json({ errMsg: error.message || "Something went wrong." });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default bootstrap;
