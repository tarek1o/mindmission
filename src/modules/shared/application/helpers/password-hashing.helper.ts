import { hash, compare } from 'bcrypt';

export abstract class PasswordHashingHelper {
  static hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  static compare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}