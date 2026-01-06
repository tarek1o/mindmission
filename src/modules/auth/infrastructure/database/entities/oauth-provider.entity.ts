import {
  Column,
  DeepPartial,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { OAuthProviderEnum } from 'src/modules/auth/domain/enums/oauth-provider.enum';
import { BaseEntity } from 'src/modules/shared/infrastructure/database/entities/base.entity';
import { UserEntity } from 'src/modules/user/infrastructure/database/entities/user.entity';
import { OAUTH_PROVIDER_INDEXES_CONSTANTS } from '../constants/oauth-provider-indexes.constant';

@Entity({ name: 'oauth_providers' })
@Index(
  OAUTH_PROVIDER_INDEXES_CONSTANTS.OAUTH_PROVIDERS_PROVIDER_ID_USER_ID_PARTIAL_UNIQUE_INDEX,
  ['provider', 'userId'],
  {
    unique: true,
    where: '"deleted_at" IS NULL',
  },
)
export class OAuthProviderEntity extends BaseEntity {
  @Column({ name: 'provider_id', type: 'varchar', length: 255 })
  providerId: string;

  @Column({ name: 'provider', type: 'varchar', length: 255 })
  provider: OAuthProviderEnum;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.oauthProviders, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  constructor(oauthProvider?: DeepPartial<OAuthProviderEntity>) {
    super(oauthProvider);
    Object.assign(this, oauthProvider);
  }
}
