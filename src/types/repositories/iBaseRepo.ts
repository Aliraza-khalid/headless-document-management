export interface IBaseRepository<T> {
  findAll(options?: FindAllOptions): Promise<Record<string, any>[]>;
  findById(id: string): Promise<Record<string, any>>;
  findOne(where: Partial<T>): Promise<Record<string, any>>;
  create(data: Partial<T>): Promise<Record<string, any>>;
  createMany(data: Partial<T>[]): Promise<Record<string, any>[]>;
  update(id: string, data: Partial<T>): Promise<Record<string, any> | null>;
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
