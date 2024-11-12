import { injectable } from "inversify";
import bcrypt from "bcrypt";

@injectable()
export default class HashService {
  private SALT_ROUNDS = 10;

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async verifyPassword(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
}
