import { CurrencyEnum } from "src/modules/shared/domain/enums/currency.enum";
import { PriceModel } from "src/modules/shared/domain/models/price.model";

export class PriceResponseDto {
  value: number;
  currency: CurrencyEnum;

  constructor(model: PriceModel) {
    this.value = model.value;
    this.currency = model.currency;
  }
}