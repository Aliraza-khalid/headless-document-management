import BaseRepository from "./base.repository";
import { inject, injectable } from "inversify";
import { DB } from "../db/schema";
import { ContainerTokens } from "../types/container";
import { UserTable } from "../db/schema/User";

@injectable()
export default class UserRepository extends BaseRepository<typeof UserTable> {
  constructor(@inject(ContainerTokens.DB) db: DB) {
    super(db, UserTable);
  }
}
