import { Router } from "express";
import { GetUser, CreateUser, GetUserProfile } from "../controllers/users.controller";
import adminMiddleware from "../middlewares/Admin.middleware";

const userRouter = Router();

userRouter.post("/", adminMiddleware, CreateUser);
userRouter.get("/profile", GetUserProfile);
userRouter.get("/:userId", adminMiddleware, GetUser);

export default userRouter;
