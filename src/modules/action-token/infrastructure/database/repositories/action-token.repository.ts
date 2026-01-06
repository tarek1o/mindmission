import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, MoreThan, Repository } from 'typeorm';
import { IActionTokenRepository } from 'src/modules/action-token/application/interfaces/action-token-repository.interface';
import { ActionTokenEntity } from '../entities/action-token.entity';
import { ActionTokenModel } from 'src/modules/action-token/domain/models/action-token.model';
import { ActionTokenMapper } from '../mapper/action-token.mapper';
import { ActionTokenTypeEnum } from 'src/modules/action-token/domain/enums/action-token-type.enum';

@Injectable()
export class ActionTokenRepository implements IActionTokenRepository {
  constructor(
    @InjectRepository(ActionTokenEntity)
    private readonly actionTokenRepository: Repository<ActionTokenEntity>,
  ) {}

  async getByToken(
    type: ActionTokenTypeEnum,
    token: string,
  ): Promise<ActionTokenModel | null> {
    const actionToken = await this.actionTokenRepository.findOne({
      where: { type, token },
    });
    return actionToken ? ActionTokenMapper.toModel(actionToken) : null;
  }

  async getByTokenAndUUID(
    type: ActionTokenTypeEnum,
    token: string,
    uuid: string,
  ): Promise<ActionTokenModel | null> {
    const actionToken = await this.actionTokenRepository.findOne({
      where: { type, token, uuid },
    });
    return actionToken ? ActionTokenMapper.toModel(actionToken) : null;
  }

  async getActiveTokensByUserIdAndTokenType(
    userId: number,
    type: ActionTokenTypeEnum,
  ): Promise<ActionTokenModel[]> {
    const actionTokens = await this.actionTokenRepository.find({
      where: {
        userId,
        type,
        isRevoked: false,
        expiresAt: MoreThan(new Date()),
      },
    });
    return actionTokens.map((actionToken) =>
      ActionTokenMapper.toModel(actionToken),
    );
  }

  async getByUserIdAndToken(
    userId: number,
    token: string,
  ): Promise<ActionTokenModel | null> {
    const actionToken = await this.actionTokenRepository.findOne({
      where: { userId, token },
    });
    return actionToken ? ActionTokenMapper.toModel(actionToken) : null;
  }

  async save(
    actionToken: ActionTokenModel,
    manager?: EntityManager,
  ): Promise<ActionTokenModel> {
    const actionTokenEntity = ActionTokenMapper.toEntity(actionToken);
    const actionTokenRepository =
      manager?.getRepository(ActionTokenEntity) ?? this.actionTokenRepository;
    const savedActionToken =
      await actionTokenRepository.save(actionTokenEntity);
    return ActionTokenMapper.toModel(savedActionToken);
  }

  async saveMany(
    actionTokens: ActionTokenModel[],
    manager?: EntityManager,
  ): Promise<ActionTokenModel[]> {
    const entities = actionTokens.map((actionToken) =>
      ActionTokenMapper.toEntity(actionToken),
    );
    const actionTokenRepository =
      manager?.getRepository(ActionTokenEntity) ?? this.actionTokenRepository;
    const savedEntities = await actionTokenRepository.save(entities);
    return savedEntities.map((entity) => ActionTokenMapper.toModel(entity));
  }
}
