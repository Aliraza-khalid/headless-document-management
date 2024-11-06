import { Router } from "express";
import {
  CreateDocument,
  DeleteDocument,
  DownloadDocument,
  GetDocumentLink,
  UpdateDocument,
  UpdateDocumentPermissions,
  GetAllDocuments,
} from "../controllers/documents.controller";
import Multer from "../servcies/multer.service";

const documentRouter = Router();

documentRouter.post("/", Multer.single("file"), CreateDocument);
documentRouter.get("/:documentId", GetDocumentLink);
documentRouter.get("/download/:linkId", DownloadDocument);
documentRouter.get("/", GetAllDocuments);
documentRouter.put("/permissions/:documentId", UpdateDocumentPermissions);
documentRouter.patch("/:documentId", UpdateDocument);
documentRouter.delete("/:documentId", DeleteDocument);

export default documentRouter;
