import { DocumentDAO } from "../db/schema/documents";

export const FILES_STORAGE = new Map<
  string,
  { document: DocumentDAO; expiresAt: number }
>();
