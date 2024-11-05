import { SQL, and, eq, gte, ilike, lte } from "drizzle-orm";
import db from "../db/schema";
import { Documents, DocumentDAO, NewDocument } from "../db/schema/documents";
import { DocumentsUsers } from "../db/schema/documentsUsers";
import {
  DocumentResponseDTO,
  DocumentsSearchParams,
  UpdateDocumentDTO,
  UpdateDocumentPermissionsDTO,
} from "../dto/documents.dto";

export async function createDocument(
  documentData: NewDocument
): Promise<DocumentDAO> {
  try {
    const newDocument = await db
      .insert(Documents)
      .values({
        ...documentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newDocument[0];
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
}

export async function getAllDocuments(
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
    const filters: SQL[] = [];

    if (searchFilter) filters.push(ilike(Documents.title, `%${searchFilter}%`));
    if (isProtected)
      filters.push(eq(Documents.isProtected, isProtected === 'true'));
    if (mimeType) filters.push(eq(Documents.mimeType, mimeType));
    if (sizeGreaterThan)
      filters.push(gte(Documents.size, Number(sizeGreaterThan)));
    if (sizeLessThan) filters.push(lte(Documents.size, Number(sizeLessThan)));

    const result = await db
      .select()
      .from(Documents)
      .where(and(...filters));

    return result.map((row) => ({
      id: row.id,
      title: row.title,
      authorId: row.authorId,
      size: row.size,
      isProtected: row.isProtected,
      mimeType: row.mimeType,
      createdAt: row.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching Documents:", error);
    throw error;
  }
}

export async function getDocumentWithUsers(
  documentId: string
): Promise<DocumentDAO | null> {
  try {
    const results = await db
      .select()
      .from(Documents)
      .leftJoin(DocumentsUsers, eq(Documents.id, DocumentsUsers.documentId))
      .where(eq(Documents.id, documentId));

    if (!results?.length) return null;

    const document = {
      ...results[0].documents!,
      usersAuthorized: results.reduce(
        (acc, e) =>
          e.documents_users ? [...acc, e.documents_users.userId] : acc,
        [] as string[]
      ),
    };

    return document;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
}

export async function updateDocumentByAuthor(
  documentId: string,
  authorId: string,
  documentData: UpdateDocumentDTO
): Promise<boolean> {
  try {
    const result = await db
      .update(Documents)
      .set({ ...documentData, updatedAt: new Date() })
      .where(
        and(eq(Documents.id, documentId), eq(Documents.authorId, authorId))
      );

    if (!result.rowCount) throw new Error("Cannot update document");
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

export async function updateDocumentPermissionsByAuthor(
  documentId: string,
  authorId: string,
  data: UpdateDocumentPermissionsDTO
): Promise<boolean> {
  try {
    const result = await db
      .update(Documents)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(eq(Documents.id, documentId), eq(Documents.authorId, authorId))
      );
    if (!result.rowCount) throw new Error("Cannot update document");

    if (data.usersAuthorized) {
      await db
        .delete(DocumentsUsers)
        .where(eq(DocumentsUsers.documentId, documentId));
    }

    if (data.usersAuthorized?.length) {
      await db.insert(DocumentsUsers).values(
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

export async function deleteDocumentByAuthor(
  documentId: string,
  authorId: string
): Promise<boolean> {
  try {
    const result = await db
      .delete(Documents)
      .where(
        and(eq(Documents.id, documentId), eq(Documents.authorId, authorId))
      );

    if (!result.rowCount) throw new Error("Cannot delete document");
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}
