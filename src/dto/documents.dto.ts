import z, { array, boolean, string } from "zod";
import { DocumentDAO } from "../db/schema/Document";
import { PaginationOptions } from "../types/pagination";

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

const DocumentsPaginationOptions = PaginationOptions.extend({
  sortBy: z.enum(["createdAt", "title", "size"]).default("createdAt"),
});

export type DocumentsPaginationOptions = z.infer<
  typeof DocumentsPaginationOptions
>;

export const GetAllDocumentsDTO = DocumentsSearchParams.merge(
  DocumentsPaginationOptions
);

export type GetAllDocumentsDTO = z.infer<typeof GetAllDocumentsDTO>;

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
