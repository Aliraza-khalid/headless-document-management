import z, { array, boolean, object, string } from "zod";

export const CreateDocumentDto = z.object({
  title: string(),
  metadata: object({}).optional(),
  isProtected: boolean().default(false),
  usersAuthorized: array(string().uuid()).optional(),
});
