import { PgTableWithColumns } from "drizzle-orm/pg-core";

export interface IBaseRepository<T extends PgTableWithColumns<any>> {
  findAll(options?: FindAllOptions): Promise<T['$inferSelect'][]>;
  findById(id: string): Promise<T['$inferSelect']>;
  findOne(where: Record<string, any>): Promise<T['$inferSelect']>;
  create(data: T["$inferInsert"]): Promise<T['$inferSelect']>;
  createMany(data: T["$inferInsert"][]): Promise<T['$inferSelect'][]>;
  update(id: string, data: T["$inferInsert"]): Promise<T['$inferSelect'] | null>;
  delete(id: string): Promise<boolean>;
  count(where?: Record<string, any>): Promise<number>;
}

export interface FindAllOptions {
  where?: Record<string, any>;
  orderBy?: string;
  orderDirection?: OrderDirection;
  limit?: number;
  offset?: number;
}

export type OrderDirection = "asc" | "desc";
