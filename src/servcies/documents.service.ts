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

export async function createDocument(
  documentData: NewDocument
): Promise<DocumentDAO> {
  try {
    const newDocument = await db
      .insert(Document)
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

    return result.map((row) => ({
      id: row.id,
      title: row.title,
      authorId: row.authorId,
      size: row.size,
      isProtected: row.isProtected,
      mimeType: row.mimeType,
      tags: row.tags,
      createdAt: row.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching Document:", error);
    throw error;
  }
}

export async function getDocumentWithUsers(
  documentId: string
): Promise<DocumentDAO | null> {
  try {
    const results = await db
      .select()
      .from(Document)
      .leftJoin(DocumentUser, eq(Document.id, DocumentUser.documentId))
      .where(eq(Document.id, documentId));

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
      .update(Document)
      .set({ ...documentData, updatedAt: new Date() })
      .where(and(eq(Document.id, documentId), eq(Document.authorId, authorId)));

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
      .update(Document)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(Document.id, documentId), eq(Document.authorId, authorId)));
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

export async function deleteDocumentByAuthor(
  documentId: string,
  authorId: string
): Promise<boolean> {
  try {
    const result = await db
      .delete(Document)
      .where(and(eq(Document.id, documentId), eq(Document.authorId, authorId)));

    if (!result.rowCount) throw new Error("Cannot delete document");
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}
