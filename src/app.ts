import { Container } from "inversify";
import { ContainerTokens } from "./types/container";
import { db } from "./db/schema";
import { InversifyExpressServer } from "inversify-express-utils";
import DocumentRepository from "./repositories/document.repository";
import DocumentService from "./servcies/documents.service";
import DocumentController from "./controllers/documents.controller";
import UserService from "./servcies/users.service";
import UserController from "./controllers/users.controller";
import UserRepository from "./repositories/user.repository";
import AuthController from "./controllers/auth.controller";
import AuthService from "./servcies/auth.service";
import HashService from "./servcies/hash.service";
import { json } from "express";

const container = new Container();

container.bind(ContainerTokens.DB).toConstantValue(db);

container.bind(ContainerTokens.AuthService).to(AuthService);
container.bind(ContainerTokens.HashService).to(HashService);
container.bind(ContainerTokens.AuthController).to(AuthController);

container.bind(ContainerTokens.UserRepository).to(UserRepository);
container.bind(ContainerTokens.UserService).to(UserService);
container.bind(ContainerTokens.UserController).to(UserController);

container.bind(ContainerTokens.DocumentRepository).to(DocumentRepository);
container.bind(ContainerTokens.DocumentService).to(DocumentService);
container.bind(ContainerTokens.DocumentController).to(DocumentController);

const server = new InversifyExpressServer(container);
server.setConfig((app) => app.use(json()));
const app = server.build();

export default app;
