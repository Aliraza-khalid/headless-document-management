import z, { array, boolean, string } from "zod";

export const CreateDocumentDTO = z
  .object({
    title: string(),
    metaData: z.record(z.string(), z.any()).optional(),
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
