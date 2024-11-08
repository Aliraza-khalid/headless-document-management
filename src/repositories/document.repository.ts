import { and, eq } from "drizzle-orm";
import { DocumentDAO, NewDocument, Document } from "../db/schema/Document";
import BaseRepository from "./base.repository";
import { injectable } from "inversify";

@injectable()
export default class DocumentRepository extends BaseRepository<
  typeof Document
> {
  constructor(db: any, model: any) {
    super(db, Document);
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

  async deleteDocument(documentId: string, authorId: string): Promise<boolean> {
    const result = await this.db
      .delete(Document)
      .where(and(eq(Document.id, documentId), eq(Document.authorId, authorId)));

    if (!result.rowCount) throw new Error("Cannot delete document");
    return true;
  }
}
