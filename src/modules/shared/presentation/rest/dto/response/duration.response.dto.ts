import { DurationUnitEnum } from "src/modules/shared/domain/enums/duration-unit.enum";
import { DurationModel } from "src/modules/shared/domain/models/duration.model";

export class DurationResponseDto {
  value: number;
  unit: DurationUnitEnum;

  constructor(model: DurationModel) {
    this.value = model.value;
    this.unit = model.unit;
  }
}