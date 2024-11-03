import { Document } from "../db/schema/documents";

export const FILES_STORAGE = new Map<
  string,
  { document: any; expiresAt: number }
>();
