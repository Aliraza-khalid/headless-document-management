import {
  PgDatabase,
  PgTableWithColumns,
  TableConfig,
  PgTable,
} from "drizzle-orm/pg-core";
import {
  FindAllOptions,
  IBaseRepository,
} from "../types/repositories/iBaseRepo";
import { SQL, and, count, desc, eq } from "drizzle-orm";

export default class BaseRepository<Model extends PgTable<TableConfig>>
  implements IBaseRepository<PgTableWithColumns<any>>
{
  constructor(
    protected readonly db: PgDatabase<any>,
    protected readonly model: any
  ) {}

  async findAll(options?: FindAllOptions): Promise<any> {
    let query = this.db.select().from(this.model);

    if (options?.where) {
      const whereConditions: SQL[] = [];
      Object.entries(options.where).forEach(([key, value]) => {
        whereConditions.push(eq(this.model[key], value));
      });
      query.where(and(...whereConditions));
    }

    if (options?.orderBy) {
      query.orderBy(
        options.orderDirection === "desc"
          ? desc(this.model[options.orderBy])
          : this.model[options.orderBy]
      );
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    if (options?.offset) {
      query.offset(options.offset);
    }

    return query;
  }

  async findById(id: string): Promise<Record<string, any>> {
    const result = await this.db
      .select()
      .from(this.model)
      .where(eq(this.model.id, id))
      .limit(1);

    return result;
  }

  async findOne(where: Partial<Model>): Promise<Record<string, any>> {
    const whereConditions: SQL[] = [];
    Object.entries(where).forEach(([key, value]) => {
      whereConditions.push(eq(this.model[key], value));
    });

    const [result] = await this.db
      .select()
      .from(this.model)
      .where(and(...whereConditions))
      .limit(1);

    return result;
  }

  async create(data: Partial<Model>): Promise<Model> {
    const [result] = await this.db.insert(this.model).values(data).returning();
    return result;
  }

  async createMany(data: Partial<Model>[]): Promise<Model[]> {
    return this.db.insert(this.model).values(data).returning();
  }

  async update(id: string, data: Partial<Model>): Promise<Model | null> {
    const [result] = await this.db
      .update(this.model)
      .set(data)
      .where(eq(this.model.id, id))
      .returning();

    return result || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(this.model)
      .where(eq(this.model.id, id));

    return true;
  }

  async count(where?: Partial<Model>): Promise<number> {
    let query = this.db.select({ count: count() }).from(this.model);

    if (where) {
      const whereConditions: SQL[] = [];
      Object.entries(where).forEach(([key, value]) => {
        whereConditions.push(eq(this.model[key], value));
      });
      query.where(and(...whereConditions));
    }

    const [result] = await query;
    return Number(result.count) || 0;
  }
}
