import { Column, DeepPartial, Entity, Index, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "src/modules/shared/infrastructure/database/entities/base.entity";
import { UserTypeEnum } from "src/modules/user/domain/enums/user-type.enum";
import { RoleEntity } from "src/modules/role/infrastructure/database/entities/role.entity";
import { ActionTokenEntity } from "src/modules/action-token/infrastructure/database/entities/action-token.entity";
import { UserProfileChangeEntity } from "./user-profile-change.entity";
import { AppUiEnum } from "src/modules/shared/domain/enums/app-ui.enum";
import { USER_INDEXES_CONSTANTS } from "../constants/user-indexes.constant";
import { OAuthProviderEntity } from "src/modules/auth/infrastructure/database/entities/oauth-provider.entity";

@Entity({ name: 'users' })
@Index(USER_INDEXES_CONSTANTS.USERS_APP_UI_EMAIL_PARTIAL_UNIQUE_INDEX, ['appUi', 'email'], {
  unique: true,
  where: '"deleted_at" IS NULL'
})
export class UserEntity extends BaseEntity {
  @Column({ name: 'first_name', type: 'varchar', length: 60 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 60 })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'password', type: 'varchar', length: 100 })
  password: string;

  @Column({ name: 'is_password_set', type: 'boolean', default: true })
  isPasswordSet: boolean;

  @Column({ name: 'last_update_password_time', type: 'date', nullable: true })
  lastUpdatePasswordTime: Date | null;
  
  @Column({ name: 'picture', type: 'varchar', nullable: true })
  picture: string | null;

  @Column({ name: 'types', type: 'varchar', length: 255, array: true })
  types: UserTypeEnum[];

  @Column({ name: 'app_ui', type: 'varchar', length: 255 })
  appUi: AppUiEnum;
  
  @Column({ name: 'mobile_phone', type: 'varchar', length: 20, nullable: true })  
  mobilePhone: string | null;

  @Column({ name: 'whatsapp_number', type: 'varchar', length: 20, nullable: true })  
  whatsAppNumber: string | null;

  @Column({ name: 'is_protected', type: 'boolean', default: false })  
  isProtected: boolean;

  @Column({ name: 'is_blocked', type: 'boolean', default: false })  
  isBlocked: boolean;

  @ManyToMany(() => RoleEntity, role => role.users)
  roles: RoleEntity[];

  @OneToMany(() => ActionTokenEntity, actionToken => actionToken.user)
  actionTokens: ActionTokenEntity[];
  
  @OneToMany(() => UserProfileChangeEntity, change => change.user)
  profileChanges: UserProfileChangeEntity[];

  @OneToMany(() => OAuthProviderEntity, oauthProvider => oauthProvider.user)
  oauthProviders: OAuthProviderEntity[];

  constructor(user?: DeepPartial<UserEntity>) {
    super(user);
    Object.assign(this, user);
  }
}