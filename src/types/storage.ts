import { DocumentDAO } from "../db/schema/Document";

export type MemoryStorage = { document: DocumentDAO; expiresAt: number };
