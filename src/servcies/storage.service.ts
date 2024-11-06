import { DocumentDAO } from "../db/schema/Document";
import { MemoryStorage } from "../types/storage";
import crypto from "crypto";

const EXPIRY_TIME = 2 * 60 * 1000;

const FILES_STORAGE = new Map<string, MemoryStorage>();

setInterval(() => {
  cleanup();
}, 60 * 1000);

function cleanup() {
  const now = Date.now();

  for (const [token, { expiresAt }] of FILES_STORAGE.entries()) {
    if (now > expiresAt) {
      FILES_STORAGE.delete(token);
    }
  }
}

export function getDocumentFromStorage(token: string): MemoryStorage | null {
  const data = FILES_STORAGE.get(token);

  if (!data) {
    return null;
  }

  if (Date.now() > data.expiresAt) {
    FILES_STORAGE.delete(token);
    return null;
  }

  return data;
}

export function generateDocumentToken(document: DocumentDAO): string {
  cleanup();

  const token = crypto.randomBytes(32).toString("hex");

  FILES_STORAGE.set(token, {
    document,
    expiresAt: Date.now() + EXPIRY_TIME,
  });

  return token;
}
