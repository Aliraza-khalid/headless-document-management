import { PgDatabase, PgTableWithColumns } from "drizzle-orm/pg-core";
import {
  FindAllOptions,
  IBaseRepository,
} from "../types/repositories/iBaseRepo";
import { SQL, and, count, desc, eq } from "drizzle-orm";

export default class BaseRepository<Model extends PgTableWithColumns<any>>
  implements IBaseRepository<Model>
{
  constructor(
    protected readonly db: PgDatabase<any>,
    protected readonly model: Model
  ) {}

  async findAll(options?: FindAllOptions) {
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

  async findById(id: string) {
    const [result] = await this.db
      .select()
      .from(this.model)
      .where(eq(this.model.id, id));

    return result as Model["$inferSelect"];
  }

  async findOne(where: Record<string, any>) {
    const whereConditions: SQL[] = [];
    Object.entries(where).forEach(([key, value]) => {
      whereConditions.push(eq(this.model[key], value));
    });

    const [result] = await this.db
      .select()
      .from(this.model)
      .where(and(...whereConditions))
      .limit(1);

    return result as Model["$inferSelect"];
  }

  async create(data: Model["$inferInsert"]) {
    const [result] = await this.db
      .insert(this.model)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result as Model["$inferSelect"];
  }

  async createMany(data: Model["$inferInsert"][]) {
    return this.db.insert(this.model).values(data).returning();
  }

  async update(id: string, data: Model["$inferInsert"]) {
    const [result] = await this.db
      .update(this.model)
      .set(data)
      .where(eq(this.model.id, id))
      .returning();

    return result as Model["$inferSelect"];
  }

  async delete(id: string) {
    const result = await this.db
      .delete(this.model)
      .where(eq(this.model.id, id));

    return true;
  }

  async count(where?: Record<string, any>) {
    let query = this.db.select({ count: count() }).from(this.model);

    if (where) {
      const whereConditions: SQL[] = [];
      Object.entries(where).forEach(([key, value]) => {
        whereConditions.push(eq(this.model[key], value));
      });
      query.where(and(...whereConditions));
    }

    const [result] = await query;
    return result.count;
  }
}
