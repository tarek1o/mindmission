import { IsEnum, IsNotEmpty, IsNumber, Min } from "class-validator";
import { DurationUnitEnum } from "src/modules/shared/domain/enums/duration-unit.enum";
import { DurationProps } from "src/modules/shared/domain/interfaces/duration-props.interface";

export class DurationDto implements DurationProps {
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsEnum(DurationUnitEnum)
  @IsNotEmpty()
  unit: DurationUnitEnum;
}