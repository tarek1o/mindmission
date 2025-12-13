import { IOrder } from "src/modules/shared/application/interfaces/order.interface";
import { AllowedCategoryOrderColumnsEnum } from "src/modules/category/application/enums/allowed-category-order-columns.enum";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { OrderDirectionEnum } from "src/modules/shared/application/enums/order-direction.enum";

export class CategoryOrderDto implements IOrder<AllowedCategoryOrderColumnsEnum> {
  @Transform(({ value }) => Array.isArray(value) ? value[value.length - 1] : value)
  @IsEnum(AllowedCategoryOrderColumnsEnum, { each: true })
  @IsOptional()
  orderBy: AllowedCategoryOrderColumnsEnum = AllowedCategoryOrderColumnsEnum.CREATED_AT;

  @Transform(({ value }) => Array.isArray(value) ? value[value.length - 1] : value)
  @IsEnum(OrderDirectionEnum, { each: true })
  @IsOptional()
  orderDirection: OrderDirectionEnum = OrderDirectionEnum.DESC;
}