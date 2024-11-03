import { Router } from "express";
import {
  CreateDocument,
  GetDocumentById,
} from "../controllers/documents.controller";
import Multer from "../servcies/multer.service";

const DocumentRouter = Router();

DocumentRouter.post("/", Multer.single("file"), CreateDocument);
DocumentRouter.get("/:documentId", GetDocumentById);

export default DocumentRouter;
