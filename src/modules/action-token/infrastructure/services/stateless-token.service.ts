import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as moment from 'moment';
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { StringValue } from "ms";
import { ITokenStrategy } from "../../application/interfaces/action-token-strategy.interface";
import { ActionTokenModel } from "../../domain/models/action-token.model";
import { ActionTokenTypeEnum } from "../../domain/enums/action-token-type.enum";
import { IEnvironmentConfiguration } from "src/infrastructure/configuration/interfaces/config.interface";
import { IActionTokenConfiguration, StatelessTokenConfig } from "src/infrastructure/configuration/interfaces/sub-interfaces/action-token-config.interface";
import { TokenStrategyType } from "../../application/enums/token-strategy-type.enum";

@Injectable()
export class StatelessTokenStrategy implements ITokenStrategy {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<IEnvironmentConfiguration, true>,
  ) {}

  private getStatelessTokenConfig(type: ActionTokenTypeEnum): StatelessTokenConfig {
    const statelessTokenConfig: StatelessTokenConfig = this.configService.get<IActionTokenConfiguration>('actionTokens').stateless[type];
    if(!statelessTokenConfig) {
      throw new Error(`No config has been provided for ${type} stateless token`);
    }
    return statelessTokenConfig;
  }

  private getExpirationDate(type: ActionTokenTypeEnum): Date | null {
    const { expiresIn } = this.getStatelessTokenConfig(type);
    return expiresIn ? moment().add(expiresIn.value, expiresIn.unit).toDate() : null;
  }

  private getSignOptions(type: ActionTokenTypeEnum): JwtSignOptions {
    const { secret, expiresIn } = this.getStatelessTokenConfig(type);
    const options: JwtSignOptions = { secret };
    if(expiresIn) {
      options.expiresIn = `${expiresIn.value}${expiresIn.unit}` as StringValue;
    }
    return options;
  }

  async generate<T>(options: { type: ActionTokenTypeEnum, payload: T }): Promise<ActionTokenModel> {
    const signOptions = this.getSignOptions(options.type);
    const token = await this.jwtService.signAsync(options.payload as object, signOptions);
    const expiresAt = this.getExpirationDate(options.type);
    return new ActionTokenModel({
      token,
      type: options.type,
      strategy: TokenStrategyType.STATELESS,
      payload: options.payload,
      expiresAt,
    });
  }

  async verify(type: ActionTokenTypeEnum, token: string): Promise<ActionTokenModel> {
    const { secret } = this.getStatelessTokenConfig(type);
    const { iat, exp, ...payload } = await this.jwtService.verify(token, { secret });
    return new ActionTokenModel({
      type,
      token,
      strategy: TokenStrategyType.STATELESS,
      payload,
      expiresAt: moment.unix(exp).toDate(),
    })
  }
}
