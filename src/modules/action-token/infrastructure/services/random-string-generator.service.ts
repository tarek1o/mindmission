import * as crypto from 'crypto';
import { ITokenRawStrategy } from '../../application/interfaces/token-raw-strategy.interface';

export class RandomStringGeneratorService implements ITokenRawStrategy {
  generate(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
}
