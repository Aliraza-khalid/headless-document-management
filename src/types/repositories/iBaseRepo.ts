export interface IBaseRepository<T extends object> {
  findAll(options?: FindAllOptions): Promise<T[]>;
  findById(id: string): Promise<Record<string, any>>;
  findOne(where: Partial<T>): Promise<Record<string, any>>;
  create(data: Partial<T>): Promise<T>;
  createMany(data: Partial<T>[]): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(where?: Partial<T>): Promise<number>;
}

export interface FindAllOptions {
  where?: Record<string, any>;
  orderBy?: string;
  orderDirection?: OrderDirection;
  limit?: number;
  offset?: number;
}

export type OrderDirection = "asc" | "desc";
