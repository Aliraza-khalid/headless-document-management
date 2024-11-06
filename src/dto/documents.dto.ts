import z, { array, boolean, string } from "zod";
import { DocumentDAO } from "../db/schema/documents";

export const CreateDocumentDTO = z
  .object({
    title: string(),
    tags: z.array(string()).optional(),
    metaData: z.record(string(), z.any()).optional(),
  })
  .strict();

export type CreateDocumentDTO = z.infer<typeof CreateDocumentDTO>;

export const UpdateDocumentDTO = CreateDocumentDTO.partial().strict();

export type UpdateDocumentDTO = z.infer<typeof UpdateDocumentDTO>;

export const UpdateDocumentPermissionsDTO = z
  .object({
    isProtected: boolean().optional(),
    usersAuthorized: array(string().uuid()).optional(),
  })
  .strict();

export type UpdateDocumentPermissionsDTO = z.infer<
  typeof UpdateDocumentPermissionsDTO
>;

export const DocumentsSearchParams = z
  .object({
    mimeType: z.string(),
    isProtected: z.string(),
    searchFilter: z.string(),
    sizeLessThan: z.string(),
    sizeGreaterThan: z.string(),
  })
  .partial();

export type DocumentsSearchParams = z.infer<typeof DocumentsSearchParams>;

export type DocumentResponseDTO = Pick<
  DocumentDAO,
  | "id"
  | "title"
  | "createdAt"
  | "isProtected"
  | "authorId"
  | "mimeType"
  | "size"
  | "tags"
>;
