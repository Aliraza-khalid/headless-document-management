import { createInsertSchema } from "drizzle-zod";
import z, { array, boolean, object, string } from "zod";
import { Documents } from "../db/schema/documents";

export const CreateDocumentDTO = z.object({
  title: string(),
  metadata: object({}).optional(),
  isProtected: boolean().default(false),
  usersAuthorized: array(string().uuid()).optional(),
});

const CreateDocumentDAO = createInsertSchema(Documents, {});
