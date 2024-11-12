import { DocumentDAO, NewDocument } from "../db/schema/Document";
import {
  DocumentResponseDTO,
  DocumentsSearchParams,
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

@injectable()
export default class DocumentService {
  constructor(
    @inject(ContainerTokens.DocumentRepository)
    private readonly documentRepository: DocumentRepository
  ) {}

  async createDocument(
    documentData: NewDocument
  ): Promise<DocumentResponseDTO> {
    try {
      const newDocument = await this.documentRepository.insertDocument(
        documentData
      );
      return documentModelToDto(newDocument);
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  }

  async getAllDocuments(
    params: DocumentsSearchParams
  ): Promise<DocumentResponseDTO[]> {
    try {
      const result = await this.documentRepository.searchAllDocuments(params);
      return result.map((row) => documentModelToDto(row));
    } catch (error) {
      console.error("Error fetching Document:", error);
      throw error;
    }
  }

  async getDocumentToken(
    documentId: string,
    user: Request["user"]
  ): Promise<string> {
    try {
      const results = await this.documentRepository.findDocumentWithUsers(documentId);

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

      return generateDocumentToken(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      throw error;
    }
  }

  async downloadDocumentByLink(token: string): Promise<DocumentDAO> {
    try {
      const document = getDocumentFromStorage(token);
      if (!document) throw new CustomError("Invalid Document Link", 404);
      return document;
    } catch (error) {
      console.error("Error downloading document:", error);
      throw error;
    }
  }

  async updateDocumentByAuthor(
    documentId: string,
    authorId: string,
    documentData: UpdateDocumentDTO
  ): Promise<boolean> {
    try {
      const result = await this.documentRepository.updateDocumentByAuthor(
        documentId,
        authorId,
        documentData
      );

      if (!result) throw new Error("Cannot update document");
      return true;
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  }

  async updateDocumentPermissionsByAuthor(
    documentId: string,
    authorId: string,
    data: UpdateDocumentPermissionsDTO
  ): Promise<boolean> {
    try {
      const result = await this.documentRepository.updateDocumentByAuthor(
        documentId,
        authorId,
        data
      );
      if (!result) throw new Error("Cannot update document");

      if (data.usersAuthorized) {
        await this.documentRepository.deleteDocumentUserByDocumentId(
          documentId
        );
      }

      if (data.usersAuthorized?.length) {
        await this.documentRepository.insertDocumentUsers(
          data.usersAuthorized.map((userId) => ({
            userId,
            documentId,
          }))
        );
      }

      return true;
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  }

  async deleteDocumentByAuthor(
    documentId: string,
    authorId: string
  ): Promise<boolean> {
    try {
      const result = await this.documentRepository.deleteDocument(
        documentId,
        authorId
      );

      if (!result) throw new Error("Cannot delete document");
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  }
}
