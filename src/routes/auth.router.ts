import { Router } from "express";
import { Login } from "../controllers/auth.controller";

const AuthRouter = Router();

AuthRouter.post("/login", Login);

export default AuthRouter;
