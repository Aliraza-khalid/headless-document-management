import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import UserRouter from "./routes/user.router";
import AuthRouter from "./routes/auth.router";
import JWTMiddleware from "./middlewares/JWT.middleware";
import ErrorMiddleware from "./middlewares/Error.middleware";
import DocumentRouter from "./routes/document.router";

dotenv.config();
const port = process.env.PORT!;

const app: Express = express();

app.use(express.json());

app.use("/auth", AuthRouter);

app.use(JWTMiddleware);

app.use("/users", UserRouter);

app.use("/documents", DocumentRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(ErrorMiddleware);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
