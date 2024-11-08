import express from "express";
import authRouter from "./routes/auth.router";
import jwtMiddleware from "./middlewares/jwt.middleware";
import userRouter from "./routes/user.router";
import documentRouter from "./routes/document.router";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);

app.use(jwtMiddleware);

app.use("/user", userRouter);

app.use("/document", documentRouter);

export default app;
