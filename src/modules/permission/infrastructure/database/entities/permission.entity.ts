import {
  Entity,
  Column,
  DeepPartial,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { BaseEntity } from 'src/modules/shared/infrastructure/database/entities/base.entity';
import { ResourceEnum } from '../../../domain/enums/resource.enum';
import { ActionEnum } from '../../../domain/enums/action.enum';
import { PermissionTranslationEntity } from './permission-translation.entity';
import { RoleEntity } from 'src/modules/role/infrastructure/database/entities/role.entity';

@Entity({ name: 'permissions' })
@Index('permissions_resource_actions_partial_unique_index', ['resource', 'actions'], {
  unique: true,
  where: '"deleted_at" IS NULL'
})
export class PermissionEntity extends BaseEntity {
  @OneToMany(() => PermissionTranslationEntity, (translation) => translation.permission)
  translations: PermissionTranslationEntity[];

  @Column({ name: 'resource', type: 'varchar', length: 255 })
  resource: ResourceEnum;

  @Column({ name: 'actions', type: 'varchar', length: 255, array: true })
  actions: ActionEnum[];

  @Column({ name: 'level', type: 'int' })
  level: number;

  @Column({ name: 'is_resource_and_Actions_editable', type: 'boolean', default: true })
  isResourceAndActionsEditable: boolean;

  @Column({ name: 'is_deletable', type: 'boolean', default: true })
  isDeletable: boolean;

  @ManyToMany(() => RoleEntity, role => role.permissions)
  @JoinTable({ name: 'roles_permissions' })
  roles: RoleEntity[];

  constructor(permission?: DeepPartial<PermissionEntity>) {
    super(permission);
    Object.assign(this, permission);
  }
}
