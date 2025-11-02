import { ITokenRawStrategy } from "../../application/interfaces/token-raw-strategy.interface";

export class OTPGeneratorService implements ITokenRawStrategy {
  generate(length: number = 4): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  }
}