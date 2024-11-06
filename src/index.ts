import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.router";
import authRouter from "./routes/auth.router";
import jwtMiddleware from "./middlewares/jwt.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import documentRouter from "./routes/document.router";

dotenv.config();
const port = process.env.PORT!;

const app: Express = express();

app.use(express.json());

app.use("/auth", authRouter);

app.use(jwtMiddleware);

app.use("/user", userRouter);

app.use("/document", documentRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
