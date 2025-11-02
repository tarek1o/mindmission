import { DurationUnitEnum } from "../enums/duration-unit.enum";
import { InvalidInputError } from "../errors/invalid-input.error";
import { DurationProps } from "../interfaces/duration-props.interface";

export class DurationModel {
  private _value: number;
  unit: DurationUnitEnum;

  constructor(props: DurationProps) {
    this.value = props.value;
    this.unit = props.unit;
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    if (isNaN(value) || value < 0) {
      throw new InvalidInputError('global.duration.value.invalid');
    }
    this._value = value;
  }
}