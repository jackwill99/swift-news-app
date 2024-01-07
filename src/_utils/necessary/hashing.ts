import * as bcrypt from "bcrypt";

export class Hashing {
  static saltOrRounds = 10;

  static async hash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, Hashing.saltOrRounds);
    return hash;
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
}
