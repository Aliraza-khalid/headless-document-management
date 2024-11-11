import { json } from "express";
import authRouter from "./routes/auth.router";
import userRouter from "./routes/user.router";

import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import DocumentRepository from "./repositories/document.repository";
import DocumentService from "./servcies/documents.service";
import DocumentController from "./controllers/documents.controller";
import { ContainerTokens } from "./types/container";
import { db } from "./db/schema";

const container = new Container();

container.bind(ContainerTokens.DB).toConstantValue(db);

container.bind(ContainerTokens.DocumentRepository).to(DocumentRepository);
container.bind(ContainerTokens.DocumentService).to(DocumentService);
container.bind(ContainerTokens.DocumentController).to(DocumentController);

const server = new InversifyExpressServer(container);
const app = server.build();
app.use(json());

app.use("/auth", authRouter);

app.use("/user", userRouter);

export default app;
