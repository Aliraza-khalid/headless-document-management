import { Request, Response, NextFunction } from "express";
import { createDocument, getDocumentById } from "../servcies/documents.service";
import { CreateDocumentDto } from "../dto/documents.dto";

export async function CreateDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const validation = CreateDocumentDto.safeParse(req.body);
    if (!validation.success) return res.json(validation);

    if(!req.file) return res.status(400).json({
      success: false,
      message: 'File Not Uploaded'
    })

    const data = await createDocument({
      ...validation.data,
      data: req.file.buffer,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user.userId,
    });

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function GetDocumentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const { id } = req.params;
    const document = await getDocumentById(id);

    return res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
}
