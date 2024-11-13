import { DocumentDAO, NewDocument } from "../db/schema/Document";
import {
  DocumentResponseDTO,
  GetAllDocumentsDTO,
  UpdateDocumentDTO,
  UpdateDocumentPermissionsDTO,
} from "../dto/documents.dto";
import { documentModelToDto } from "../mappers/document.mapper";
import { UserRole } from "../enum/UserRoleEnum";
import {
  generateDocumentToken,
  getDocumentFromStorage,
} from "./storage.service";
import { CustomError } from "../middlewares/Error.middleware";
import { Request } from "express";
import DocumentRepository from "../repositories/document.repository";
import { inject, injectable } from "inversify";
import { ContainerTokens } from "../types/container";
import LoggerService from "./logger.service";
import { PaginationResponse } from "../types/pagination";

@injectable()
export default class DocumentService {
  constructor(
    @inject(ContainerTokens.Logger)
    private readonly loggerService: LoggerService,
    @inject(ContainerTokens.DocumentRepository)
    private readonly documentRepository: DocumentRepository
  ) {}

  async createDocument(
    documentData: NewDocument
  ): Promise<DocumentResponseDTO> {
    const newDocument = await this.documentRepository.insertDocument(
      documentData
    );
    this.loggerService.info(`Create Document - ${newDocument.id}`);
    return documentModelToDto(newDocument);
  }

  async getAllDocuments(
    params: GetAllDocumentsDTO
  ): Promise<PaginationResponse<DocumentResponseDTO>> {
    const { pageNumber, pageSize, sortBy, sortDirection, ...filterParams } =
      params;
    const { result, total } = await this.documentRepository.searchAllDocuments(
      {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
      },
      filterParams
    );

    this.loggerService.info(`Fetch All Documents`);
    return {
      rows: result.map((row) => documentModelToDto(row)),
      totalRows: total,
      pageNumber,
      pageSize,
    };
  }

  async getDocumentToken(
    documentId: string,
    user: Request["user"]
  ): Promise<string> {
    const results = await this.documentRepository.findDocumentWithUsers(
      documentId
    );

    if (!results?.length) throw new CustomError("Document Not Found", 404);

    const document = {
      ...results[0].documents!,
      usersAuthorized: results.reduce(
        (acc: string[], e: any) =>
          e.documents_users ? [...acc, e.documents_users.userId] : acc,
        [] as string[]
      ),
    };

    if (
      user.role !== UserRole.Enum.ADMIN &&
      document.isProtected &&
      document.authorId !== user.userId &&
      !document.usersAuthorized?.includes(user.userId)
    )
      throw new CustomError("User Not Authorized", 403);

    this.loggerService.info(`Generate Document Token - ${document.id}`);
    return generateDocumentToken(document);
  }

  async downloadDocumentByLink(token: string): Promise<DocumentDAO> {
    const document = getDocumentFromStorage(token);
    if (!document) throw new CustomError("Invalid Document Link", 404);
    this.loggerService.info(`Download Document - ${document.id}`);
    return document;
  }

  async updateDocumentByAuthor(
    documentId: string,
    authorId: string,
    documentData: UpdateDocumentDTO
  ): Promise<boolean> {
    const result = await this.documentRepository.updateDocumentByAuthor(
      documentId,
      authorId,
      documentData
    );

    if (!result) throw new Error("Cannot update document");
    this.loggerService.info(`Update Document - ${documentId}`);
    return true;
  }

  async updateDocumentPermissionsByAuthor(
    documentId: string,
    authorId: string,
    data: UpdateDocumentPermissionsDTO
  ): Promise<boolean> {
    const result = await this.documentRepository.updateDocumentByAuthor(
      documentId,
      authorId,
      data
    );
    if (!result) throw new Error("Cannot update document");

    if (data.usersAuthorized) {
      await this.documentRepository.deleteDocumentUserByDocumentId(documentId);
    }

    if (data.usersAuthorized?.length) {
      await this.documentRepository.insertDocumentUsers(
        data.usersAuthorized.map((userId) => ({
          userId,
          documentId,
        }))
      );
    }

    this.loggerService.info(`Update Document Permissions - ${documentId}`);
    return true;
  }

  async deleteDocumentByAuthor(
    documentId: string,
    authorId: string
  ): Promise<boolean> {
    const result = await this.documentRepository.deleteDocument(
      documentId,
      authorId
    );

    this.loggerService.info(`Delete Document - ${documentId}`);
    if (!result) throw new Error("Cannot delete document");
    return true;
  }
}
