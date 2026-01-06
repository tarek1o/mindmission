export interface IBaseRepository<T> {
  save(model: T, manager?: unknown): Promise<T>;
}
