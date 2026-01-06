import { DurationInputArg2 } from 'moment';
import { ActionTokenTypeEnum } from 'src/modules/action-token/domain/enums/action-token-type.enum';

export interface TokenDurationLifeTime {
  value: number;
  unit: DurationInputArg2;
}

export interface StatelessTokenConfig {
  secret: string;
  expiresIn?: TokenDurationLifeTime;
}

export interface IActionTokenConfiguration {
  stateful: {
    [ActionTokenTypeEnum.REFRESH_TOKEN]: TokenDurationLifeTime;
    [ActionTokenTypeEnum.EMAIL_VERIFICATION_TOKEN]: TokenDurationLifeTime;
    [ActionTokenTypeEnum.RESET_PASSWORD_TOKEN]: TokenDurationLifeTime;
  };
  stateless: {
    [ActionTokenTypeEnum.ACCESS_TOKEN]: StatelessTokenConfig;
  };
}
