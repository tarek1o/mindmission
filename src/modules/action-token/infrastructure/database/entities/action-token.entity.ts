import {
  Column,
  DeepPartial,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from 'src/modules/shared/infrastructure/database/entities/base.entity';
import { ActionTokenTypeEnum } from 'src/modules/action-token/domain/enums/action-token-type.enum';
import { UserEntity } from 'src/modules/user/infrastructure/database/entities/user.entity';

@Entity({ name: 'action_tokens' })
export class ActionTokenEntity extends BaseEntity {
  @Column({ name: 'uuid', type: 'varchar' })
  uuid: string;

  @Index('action_tokens_token_index', { fulltext: true })
  @Column({ name: 'token', type: 'varchar' })
  token: string;

  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId: number | null;

  @Column({ name: 'type', type: 'varchar', length: 255 })
  type: ActionTokenTypeEnum;

  @Column({ name: 'payload', type: 'jsonb', default: {} })
  payload: Record<string, any>;

  @Column({ name: 'is_revoked', type: 'boolean', default: false })
  isRevoked: boolean;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserEntity, (user) => user.actionTokens, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  constructor(partial?: DeepPartial<ActionTokenEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
