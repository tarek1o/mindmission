import { PermissionEntity } from 'src/modules/permission/infrastructure/database/entities/permission.entity';
import {
  Column,
  DeepPartial,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { RoleTranslationEntity } from './role-translation.entity';
import { BaseEntity } from 'src/modules/shared/infrastructure/database/entities/base.entity';
import { UserEntity } from 'src/modules/user/infrastructure/database/entities/user.entity';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
  @OneToMany(() => RoleTranslationEntity, (translation) => translation.role)
  translations: RoleTranslationEntity[];

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  permissions: PermissionEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roles)
  @JoinTable({ name: 'users_roles' })
  users: UserEntity[];

  @Column({ name: 'are_permissions_editable', type: 'boolean', default: true })
  arePermissionsEditable: boolean;

  @Column({ name: 'is_deletable', type: 'boolean', default: true })
  isDeletable: boolean;

  constructor(role?: DeepPartial<RoleEntity>) {
    super(role);
    Object.assign(this, role);
  }
}
