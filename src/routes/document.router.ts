import { Router } from "express";
import Multer from "../servcies/multer.service";
import { container } from "../../inversify.config";
import DocumentController from "../controllers/documents.controller";

const documentController: DocumentController = container.get("documentController");
const documentRouter = Router();

documentRouter.post("/", Multer.single("file"), documentController.createDocument);
documentRouter.get("/:documentId", documentController.getDocumentLink);
documentRouter.get("/download/:linkId", documentController.downloadDocument);
documentRouter.get("/", documentController.getAllDocuments);
documentRouter.put("/permissions/:documentId", documentController.updateDocumentPermissions);
documentRouter.patch("/:documentId", documentController.updateDocument);
documentRouter.delete("/:documentId", documentController.deleteDocument);

export default documentRouter;
