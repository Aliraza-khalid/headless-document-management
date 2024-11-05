import z, { array, boolean, object, string } from "zod";

export const CreateDocumentDTO = z.object({
  title: string(),
  metaData: z.record(z.string(), z.any()).optional(),
  isProtected: boolean().default(false),
  usersAuthorized: array(string().uuid()).optional(),
});

export const UpdateDocumentDTO = CreateDocumentDTO.partial();

export type UpdateDocumentDTO = z.infer<typeof UpdateDocumentDTO>;
