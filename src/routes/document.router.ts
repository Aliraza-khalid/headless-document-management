import { Router } from "express";
import {
  CreateDocument,
  DeleteDocument,
  DownloadDocument,
  GetDocumentLink,
  UpdateDocument,
  UpdateDocumentPermissions,
} from "../controllers/documents.controller";
import Multer from "../servcies/multer.service";

const DocumentRouter = Router();

DocumentRouter.post("/", Multer.single("file"), CreateDocument);
DocumentRouter.get("/:documentId", GetDocumentLink);
DocumentRouter.get("/download/:linkId", DownloadDocument);
DocumentRouter.put("/permissions/:documentId", UpdateDocumentPermissions);
DocumentRouter.patch("/:documentId", UpdateDocument);
DocumentRouter.delete("/:documentId", DeleteDocument);

export default DocumentRouter;
