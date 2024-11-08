import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import app from "./app";
import errorMiddleware from "./middlewares/error.middleware";

const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
