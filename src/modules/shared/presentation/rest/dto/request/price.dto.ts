import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { PriceProps } from 'src/modules/shared/domain/interfaces/price-props.interface';
import { CurrencyEnum } from 'src/modules/shared/domain/enums/currency.enum';

export class PriceDto implements PriceProps {
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  currency: CurrencyEnum;
}
