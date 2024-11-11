import { SQL, and, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import db from "../db/schema";
import { Document, DocumentDAO, NewDocument } from "../db/schema/Document";
import { DocumentUser } from "../db/schema/DocumentUser";
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
  constructor(@inject(ContainerTokens.DocumentRepository) private readonly documentRepository: DocumentRepository) {}

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
      const {
        searchFilter,
        isProtected,
        mimeType,
        sizeGreaterThan,
        sizeLessThan,
      } = params;
      const filters: (SQL | undefined)[] = [];

      if (searchFilter)
        filters.push(
          or(
            ilike(Document.title, `%${searchFilter}%`),
            sql`array_to_string(${
              Document.tags
            }, ' ') ILIKE ${`%${searchFilter}%`}`
          )
        );
      if (isProtected)
        filters.push(eq(Document.isProtected, isProtected === "true"));
      if (mimeType) filters.push(eq(Document.mimeType, mimeType));
      if (sizeGreaterThan)
        filters.push(gte(Document.size, Number(sizeGreaterThan)));
      if (sizeLessThan) filters.push(lte(Document.size, Number(sizeLessThan)));

      const result = await db
        .select()
        .from(Document)
        .where(and(...filters));

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
      const results = await db
        .select()
        .from(Document)
        .leftJoin(DocumentUser, eq(Document.id, DocumentUser.documentId))
        .where(eq(Document.id, documentId));

      if (!results?.length) throw new CustomError("Document Not Found", 404);

      const document = {
        ...results[0].documents!,
        usersAuthorized: results.reduce(
          (acc, e) =>
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
      const result = await db
        .update(Document)
        .set({ ...documentData, updatedAt: new Date() })
        .where(
          and(eq(Document.id, documentId), eq(Document.authorId, authorId))
        );

      if (!result.rowCount) throw new Error("Cannot update document");
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
      const result = await db
        .update(Document)
        .set({ ...data, updatedAt: new Date() })
        .where(
          and(eq(Document.id, documentId), eq(Document.authorId, authorId))
        );
      if (!result.rowCount) throw new Error("Cannot update document");

      if (data.usersAuthorized) {
        await db
          .delete(DocumentUser)
          .where(eq(DocumentUser.documentId, documentId));
      }

      if (data.usersAuthorized?.length) {
        await db.insert(DocumentUser).values(
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
      const result = await db
        .delete(Document)
        .where(
          and(eq(Document.id, documentId), eq(Document.authorId, authorId))
        );

      if (!result.rowCount) throw new Error("Cannot delete document");
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  }
}
