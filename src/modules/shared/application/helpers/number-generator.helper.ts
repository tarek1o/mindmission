export class NumberGeneratorHelper {
  static generate(length: number = 4): string {
    let number = '';
    for (let i = 0; i < length; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return number;
  }
}
