import { and, eq, gte, ilike, lte, or, sql, SQL } from "drizzle-orm";
import { DocumentDAO, NewDocument, Document } from "../db/schema/Document";
import BaseRepository from "./base.repository";
import { inject, injectable } from "inversify";
import { DB } from "../db/schema";
import { ContainerTokens } from "../types/container";
import { DocumentsSearchParams } from "../dto/documents.dto";
import { DocumentUser, DocumentUserDAO } from "../db/schema/DocumentUser";

@injectable()
export default class DocumentRepository extends BaseRepository<
  typeof Document
> {
  constructor(@inject(ContainerTokens.DB) db: DB) {
    super(db, Document);
  }

  async searchAllDocuments(
    filterOptions: DocumentsSearchParams
  ): Promise<DocumentDAO[]> {
    const {
      searchFilter,
      isProtected,
      mimeType,
      sizeGreaterThan,
      sizeLessThan,
    } = filterOptions;
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

    const result = await this.db
      .select()
      .from(Document)
      .where(and(...filters));

    return result;
  }

  async insertDocument(document: NewDocument): Promise<DocumentDAO> {
    const [newDocument] = await this.db
      .insert(Document)
      .values({
        ...document,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return newDocument;
  }

  async updateDocumentByAuthor(
    documentId: string,
    authorId: string,
    documentData: any
  ): Promise<boolean> {
    const result = await this.db
      .update(Document)
      .set({ ...documentData, updatedAt: new Date() })
      .where(and(eq(Document.id, documentId), eq(Document.authorId, authorId)));

    if (!result.rowCount) throw new Error("Cannot update document");
    return true;
  }

  async deleteDocument(documentId: string, authorId: string): Promise<boolean> {
    const result = await this.db
      .delete(Document)
      .where(and(eq(Document.id, documentId), eq(Document.authorId, authorId)));

    if (!result.rowCount) throw new Error("Cannot delete document");
    return true;
  }

  async insertDocumentUsers(data: DocumentUser[]): Promise<DocumentUserDAO[]> {
    return this.db.insert(DocumentUser).values(data).returning();
  }

  async deleteDocumentUserByDocumentId(documentId: string): Promise<boolean> {
    const result = await this.db
      .delete(DocumentUser)
      .where(eq(DocumentUser.documentId, documentId));

    if (!result.rowCount) throw new Error("Cannot delete document user");
    return true;
  }
}
