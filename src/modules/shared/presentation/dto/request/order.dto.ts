import { OrderDirectionEnum } from "src/modules/shared/application/enums/order-direction.enum";

export class OrderDto<T> {
  orderBy: T;
  orderDirection: OrderDirectionEnum;
}