import { CurrencyEnum } from "../enums/currency.enum";
import { PriceProps } from "../interfaces/price-props.interface";
import { InvalidInputError } from "../errors/invalid-input.error";

export class PriceModel {
  private _value: number;
  currency: CurrencyEnum;

  constructor(props: PriceProps) {
    this.value = props.value;
    this.currency = props.currency;
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    if (isNaN(value) || value < 0) {
      throw new InvalidInputError('global.price.value.invalid');
    }
    this._value = parseFloat(value.toFixed(2));
  }
}