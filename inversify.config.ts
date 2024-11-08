import { Container } from "inversify";
import DocumentRepository from "./src/repositories/document.repository";
import DocumentService from "./src/servcies/documents.service";
import DocumentController from "./src/controllers/documents.controller";

const container = new Container();
container.bind('documentRepository').to(DocumentRepository);
container.bind('documentService').to(DocumentService);
container.bind('documentController').to(DocumentController);

export { container };