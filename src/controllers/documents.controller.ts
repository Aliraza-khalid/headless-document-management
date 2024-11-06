import { Request, Response, NextFunction } from "express";
import {
  createDocument,
  deleteDocumentByAuthor,
  downloadDocumentByLink,
  getAllDocuments,
  getDocumentToken,
  updateDocumentByAuthor,
  updateDocumentPermissionsByAuthor,
} from "../servcies/documents.service";
import {
  CreateDocumentDTO,
  DocumentsSearchParams,
  UpdateDocumentDTO,
  UpdateDocumentPermissionsDTO,
} from "../dto/documents.dto";
import { CustomError } from "../middlewares/error.middleware";

export async function CreateDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const validation = CreateDocumentDTO.safeParse(req.body);
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

    const data = await createDocument({
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

export async function GetAllDocuments(
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

    const data = await getAllDocuments(validation.data);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function GetDocumentLink(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const documentId = req.params.documentId;

    const token = await getDocumentToken(documentId, req.user);

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

export async function DownloadDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const linkId = req.params.linkId;
    const document = await downloadDocumentByLink(linkId);

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

export async function UpdateDocument(
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

    await updateDocumentByAuthor(documentId, userId, validation.data);

    return res.json({
      success: true,
      message: "Document Updated",
    });
  } catch (error) {
    next(error);
  }
}

export async function UpdateDocumentPermissions(
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

    await updateDocumentPermissionsByAuthor(
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

export async function DeleteDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const userId = req.user.userId;
    const documentId = req.params.documentId;

    await deleteDocumentByAuthor(documentId, userId);

    return res.json({
      success: true,
      message: "Document Deleted",
    });
  } catch (error) {
    next(error);
  }
}
