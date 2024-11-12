import { and, eq, gte, ilike, lte, or, sql, SQL } from "drizzle-orm";
import { DocumentDAO, NewDocument, DocumentTable } from "../db/schema/Document";
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
    super(db, DocumentTable);
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
          ilike(DocumentTable.title, `%${searchFilter}%`),
          sql`array_to_string(${
            DocumentTable.tags
          }, ' ') ILIKE ${`%${searchFilter}%`}`
        )
      );
    if (isProtected)
      filters.push(eq(DocumentTable.isProtected, isProtected === "true"));
    if (mimeType) filters.push(eq(DocumentTable.mimeType, mimeType));
    if (sizeGreaterThan)
      filters.push(gte(DocumentTable.size, Number(sizeGreaterThan)));
    if (sizeLessThan) filters.push(lte(DocumentTable.size, Number(sizeLessThan)));

    const result = await this.db
      .select()
      .from(DocumentTable)
      .where(and(...filters));

    return result;
  }

  async findDocumentWithUsers(
    documentId: string
  ): Promise<Record<string, any>> {
    const results = await this.db
      .select()
      .from(this.model)
      .leftJoin(DocumentUser, eq(DocumentTable.id, DocumentUser.documentId))
      .where(eq(this.model.id, documentId));

    return results;
  }

  async insertDocument(document: NewDocument): Promise<DocumentDAO> {
    const [newDocument] = await this.db
      .insert(DocumentTable)
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
      .update(DocumentTable)
      .set({ ...documentData, updatedAt: new Date() })
      .where(and(eq(DocumentTable.id, documentId), eq(DocumentTable.authorId, authorId)));

    if (!result.rowCount) return false;
    return true;
  }

  async deleteDocument(documentId: string, authorId: string): Promise<boolean> {
    const result = await this.db
      .delete(DocumentTable)
      .where(and(eq(DocumentTable.id, documentId), eq(DocumentTable.authorId, authorId)));

    if (!result.rowCount) return false;
    return true;
  }

  async insertDocumentUsers(data: DocumentUser[]): Promise<DocumentUserDAO[]> {
    return this.db.insert(DocumentUser).values(data).returning();
  }

  async deleteDocumentUserByDocumentId(documentId: string): Promise<boolean> {
    const result = await this.db
      .delete(DocumentUser)
      .where(eq(DocumentUser.documentId, documentId));

    if (!result.rowCount) return false;
    return true;
  }
}
