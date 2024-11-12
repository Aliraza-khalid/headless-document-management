import { json } from "express";
import authRouter from "./routes/auth.router";

import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import DocumentRepository from "./repositories/document.repository";
import DocumentService from "./servcies/documents.service";
import DocumentController from "./controllers/documents.controller";
import { ContainerTokens } from "./types/container";
import { db } from "./db/schema";
import UserService from "./servcies/users.service";
import UserController from "./controllers/users.controller";
import UserRepository from "./repositories/user.repository";

const container = new Container();

container.bind(ContainerTokens.DB).toConstantValue(db);

container.bind(ContainerTokens.DocumentRepository).to(DocumentRepository);
container.bind(ContainerTokens.DocumentService).to(DocumentService);
container.bind(ContainerTokens.DocumentController).to(DocumentController);

container.bind(ContainerTokens.UserRepository).to(UserRepository);
container.bind(ContainerTokens.UserService).to(UserService);
container.bind(ContainerTokens.UserController).to(UserController);

const server = new InversifyExpressServer(container);
const app = server.build();
app.use(json());

app.use("/auth", authRouter);

export default app;
