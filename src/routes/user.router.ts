import { Router } from "express";
import { GetUser, CreateUser, GetUserProfile } from "../controllers/users.controller";
import AdminMiddleware from "../middlewares/Admin.middleware";

const UserRouter = Router();

UserRouter.post("/", AdminMiddleware, CreateUser);
UserRouter.get("/:userId", AdminMiddleware, GetUser);
UserRouter.get("/profile", GetUserProfile);

export default UserRouter;
