import { Request, Response, NextFunction } from "express";
import {
  createDocument,
  deleteDocumentByAuthor,
  getAllDocuments,
  getDocumentWithUsers,
  updateDocumentByAuthor,
  updateDocumentPermissionsByAuthor,
} from "../servcies/documents.service";
import {
  CreateDocumentDTO,
  DocumentsSearchParams,
  UpdateDocumentDTO,
  UpdateDocumentPermissionsDTO,
} from "../dto/documents.dto";
import { UserRole } from "../enum/UserRoleEnum";
import {
  generateDocumentToken,
  getDocumentFromStorage,
} from "../servcies/storage.service";

export async function CreateDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const validation = CreateDocumentDTO.safeParse(req.body);
    if (!validation.success) return res.json(validation);

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
    if (!validation.success) return res.json(validation);

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
    const { userId, role } = req.user;

    const document = await getDocumentWithUsers(documentId);

    if (!document)
      return res.status(404).json({
        success: false,
        message: "Document Not Found",
      });

    if (
      role !== UserRole.Enum.ADMIN &&
      document.isProtected &&
      document.authorId !== userId &&
      !document.usersAuthorized?.includes(userId)
    )
      return res.status(403).json({
        success: false,
        message: "User Not Authorized",
      });

    const linkId = generateDocumentToken(document);

    const downloadLink = `${req.protocol}://${req.hostname}/documents/download/${linkId}`;

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
    const document = getDocumentFromStorage(linkId);

    if (!document)
      return res.status(404).json({
        success: false,
        message: "Invalid Link",
      });

    res.setHeader("Content-Type", document.document.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.document.title}"`
    );
    res.send(document.document.data);
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
    if (!validation.success) return res.json(validation);

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
    if (!validation.success) return res.json(validation);

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
