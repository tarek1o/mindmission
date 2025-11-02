import { randomBytes } from "crypto";

export abstract class PasswordGeneratorHelper {
  static generate(length: number = 8): string {
    return randomBytes(length).toString('hex');
  }
}