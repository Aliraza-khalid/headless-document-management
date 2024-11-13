import z from "zod";

export const SortDirection = z.enum(["ASC", "DESC"]);

export const PaginationOptions = z.object({
  pageNumber: z.string().default("1").transform((v) => Number(v)),
  pageSize: z.string().default("10").transform((v) => Number(v)),
  sortDirection: SortDirection.default("DESC"),
  sortBy: z.string().default("createdAt"),
});

export type PaginationOptions = z.infer<typeof PaginationOptions>;

export type PaginationResponse<T = any> = {
  rows: T[];
  pageNumber: number;
  pageSize: number;
  totalRows: number;
};
