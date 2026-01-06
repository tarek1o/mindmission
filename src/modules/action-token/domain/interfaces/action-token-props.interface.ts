import { BaseModelProps } from 'src/modules/shared/domain/interfaces/base-model-props.interface';
import { ActionTokenTypeEnum } from 'src/modules/action-token/domain/enums/action-token-type.enum';
import { TokenStrategyType } from '../../application/enums/token-strategy-type.enum';

export interface ActionTokenProps<T> extends BaseModelProps {
  uuid?: string;
  token: string;
  type: ActionTokenTypeEnum;
  payload: T;
  strategy: TokenStrategyType;
  isRevoked?: boolean;
  userId?: number | null;
  expiresAt: Date | null;
}
