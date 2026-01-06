import { registerEnumType } from '@nestjs/graphql';
import { OrderDirectionEnum } from 'src/modules/shared/application/enums/order-direction.enum';

registerEnumType(OrderDirectionEnum, {
  name: 'OrderDirectionEnum',
  description: 'Order direction (ASC or DESC)',
});
