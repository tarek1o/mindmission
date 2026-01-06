import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionTokenEntity } from './infrastructure/database/entities/action-token.entity';
import { ActionTokenRepository } from './infrastructure/database/repositories/action-token.repository';
import { ACTION_TOKEN_REPOSITORY } from './application/constants/action-token-repository.constant';
import { TokenStrategyType } from './application/enums/token-strategy-type.enum';
import { StatefulTokenStrategy } from './infrastructure/services/stateful-token.service';
import { StatelessTokenStrategy } from './infrastructure/services/stateless-token.service';
import { TokenStrategyFactory } from './application/services/token-strategy-factory.service';
import { ActionTokenService } from './application/services/action-token.service';
import { TokenRawTypeEnum } from './application/enums/token-raw-type.enum';
import { OTPGeneratorService } from './infrastructure/services/otp-generator.service';
import { RandomStringGeneratorService } from './infrastructure/services/random-string-generator.service';
import { TokenRawStrategyManager } from './application/services/token-raw-manger.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActionTokenEntity])],
  providers: [
    {
      provide: ACTION_TOKEN_REPOSITORY,
      useClass: ActionTokenRepository,
    },
    {
      provide: TokenStrategyType.STATEFUL,
      useClass: StatefulTokenStrategy,
    },
    {
      provide: TokenStrategyType.STATELESS,
      useClass: StatelessTokenStrategy,
    },
    {
      provide: TokenRawTypeEnum.OTP,
      useClass: OTPGeneratorService,
    },
    {
      provide: TokenRawTypeEnum.RANDOM_STRING,
      useClass: RandomStringGeneratorService,
    },
    TokenStrategyFactory,
    TokenRawStrategyManager,
    ActionTokenService,
  ],
  exports: [ActionTokenService],
})
export class ActionTokenModule {}
