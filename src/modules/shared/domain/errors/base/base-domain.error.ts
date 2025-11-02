export abstract class BaseDomainError extends Error {
  constructor(message: string, public args?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
  }
}
