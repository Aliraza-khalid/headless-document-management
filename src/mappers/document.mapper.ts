import { DocumentDAO } from "../db/schema/Document";
import { DocumentResponseDTO } from "../dto/documents.dto";

export function documentModelToDto(document: DocumentDAO): DocumentResponseDTO {
  return {
    id: document.id,
    authorId: document.authorId,
    title: document.title,
    isProtected: document.isProtected,
    mimeType: document.mimeType,
    size: document.size,
    tags: document.tags,
    createdAt: document.createdAt,
  };
}
