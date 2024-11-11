import { Request, Response, NextFunction } from "express";
import {
  CreateDocumentDTO,
  DocumentsSearchParams,
  UpdateDocumentDTO,
  UpdateDocumentPermissionsDTO,
} from "../dto/documents.dto";
import { CustomError } from "../middlewares/Error.middleware";
import DocumentService from "../servcies/documents.service";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { ContainerTokens } from "../types/container";
import Multer from "../servcies/multer.service";
import JWTMiddleware from "../middlewares/JWT.middleware";

@controller('/document', JWTMiddleware)
export default class DocumentController {
  constructor(@inject(ContainerTokens.DocumentService) private readonly documentService: DocumentService) { }

  @httpPost('/', Multer.single("file"))
  async createDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const validation = CreateDocumentDTO.safeParse(req.body);
      console.log(validation.data, validation.data)
      if (!validation.success)
        throw new CustomError(
          validation.error.issues[0].message,
          400,
          validation.error.issues
        );

      if (!req.file)
        return res.status(400).json({
          success: false,
          message: "File Not Uploaded",
        });

      const data = await this.documentService.createDocument({
        ...validation.data,
        data: req.file.buffer,
        size: req.file.size,
        mimeType: req.file.mimetype,
        authorId: req.user.userId,
      });

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/')
  async getAllDocuments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const validation = DocumentsSearchParams.safeParse(req.query);
      if (!validation.success)
        throw new CustomError(
          validation.error.issues[0].message,
          400,
          validation.error.issues
        );

      console.log("CONTROLLER", this)
      const data = await this.documentService.getAllDocuments(validation.data);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.log("HELLO", error);
      next(error);
    }
  }

  async getDocumentLink(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const documentId = req.params.documentId;

      const token = await this.documentService.getDocumentToken(
        documentId,
        req.user
      );

      const downloadLink = `${req.protocol}://${req.hostname}/documents/download/${token}`;

      return res.json({
        success: true,
        data: {
          downloadLink,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async downloadDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const linkId = req.params.linkId;
      const document = await this.documentService.downloadDocumentByLink(
        linkId
      );

      res.setHeader("Content-Type", document.mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${document.title}"`
      );
      res.send(document.data);
    } catch (error) {
      next(error);
    }
  }

  async updateDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const validation = UpdateDocumentDTO.safeParse(req.body);
      if (!validation.success)
        throw new CustomError(
          validation.error.issues[0].message,
          400,
          validation.error.issues
        );

      const userId = req.user.userId;
      const documentId = req.params.documentId;

      await this.documentService.updateDocumentByAuthor(
        documentId,
        userId,
        validation.data
      );

      return res.json({
        success: true,
        message: "Document Updated",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateDocumentPermissions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const validation = UpdateDocumentPermissionsDTO.safeParse(req.body);
      if (!validation.success)
        throw new CustomError(
          validation.error.issues[0].message,
          400,
          validation.error.issues
        );

      const userId = req.user.userId;
      const documentId = req.params.documentId;

      await this.documentService.updateDocumentPermissionsByAuthor(
        documentId,
        userId,
        validation.data
      );

      return res.json({
        success: true,
        message: "Document Permissions Updated",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const userId = req.user.userId;
      const documentId = req.params.documentId;

      await this.documentService.deleteDocumentByAuthor(documentId, userId);

      return res.json({
        success: true,
        message: "Document Deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}
