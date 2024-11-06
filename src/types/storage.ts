import { DocumentDAO } from "../db/schema/documents";

export type MemoryStorage = { document: DocumentDAO; expiresAt: number };
