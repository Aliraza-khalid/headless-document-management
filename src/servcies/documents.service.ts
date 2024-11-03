import { and, eq } from "drizzle-orm";
import db from "../db/schema";
import { Documents, Document, NewDocument } from "../db/schema/documents";
import { DocumentsUsers, TDocumentsUsers } from "../db/schema/documentsUsers";
import { Users } from "../db/schema/users";

export async function createDocument(
  documentData: NewDocument
): Promise<Document> {
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

export async function getAllDocuments(): Promise<Document[]> {
  try {
    return db.select().from(Documents);
  } catch (error) {
    console.error("Error fetching Documents:", error);
    throw error;
  }
}

export async function getDocumentById(documentId: string) {
  try {
    const results = await db
      .select()
      .from(DocumentsUsers)
      .leftJoin(Users, eq(Users.id, DocumentsUsers.userId))
      .leftJoin(Documents, eq(Documents.id, DocumentsUsers.documentId))
      .where(eq(DocumentsUsers.documentId, documentId));

    const document = {
      ...results[0].documents,
      authorizedUsers: results.map((r) => r.users?.id),
    };

    return document;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
}

export async function getDocumentByAuthor(
  id: string,
  authorId: string
): Promise<Document | undefined> {
  try {
    const document = await db
      .select()
      .from(Documents)
      .where(and(eq(Documents.id, id), eq(Documents.authorId, authorId)));
    return document[0];
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
}

export async function getDocumentByAuthorized(
  id: string,
  userId: string
): Promise<Document | undefined> {
  try {
    const document = await db
      .select()
      .from(Documents)
      .leftJoin(DocumentsUsers, eq(DocumentsUsers.userId, userId))
      .where(eq(Documents.id, id));
    return document[0].documents;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
}

export async function updateDocument(
  id: string,
  documentData: Partial<NewDocument>
): Promise<Document | undefined> {
  try {
    const updatedDocument = await db
      .update(Documents)
      .set({ ...documentData, updatedAt: new Date() })
      .where(eq(Documents.id, id))
      .returning();
    return updatedDocument[0];
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

export async function deleteDocument(
  id: string
): Promise<Document | undefined> {
  try {
    const deletedDocument = await db
      .delete(Documents)
      .where(eq(Documents.id, id))
      .returning();
    return deletedDocument[0];
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}
