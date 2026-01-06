export interface IUnitOfWork {
  transaction<T>(callback: (manager: unknown) => Promise<T>): Promise<T>;
}
