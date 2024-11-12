import { injectable } from "inversify";
import bcrypt from "bcrypt";

@injectable()
export default class HashService {
  private SALT_ROUNDS = 10;

  async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      console.error("Error hashing password:", error);
      throw error;
    }
  }

  async verifyPassword(password: string, hash: string) {
    try {
      const isMatch = await bcrypt.compare(password, hash);
      return isMatch;
    } catch (error) {
      console.error("Error verifying password:", error);
      throw error;
    }
  }
}
