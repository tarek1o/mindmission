import { OrderDirectionEnum } from "../enums/order-direction.enum";

export interface IOrder<AllowedColumns> {
  orderBy: AllowedColumns;
  orderDirection: OrderDirectionEnum;
}