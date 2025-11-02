export interface IResponseWrapper<T = unknown> {
  data: T;
  message?: string;
  count?: number;
}
