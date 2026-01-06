import {
  Column,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';
import { BaseEntity } from 'src/modules/shared/infrastructure/database/entities/base.entity';

@Entity({ name: 'permission_translations' })
@Index(
  'permission_translations_language_name_partial_unique_index',
  ['language', 'name'],
  {
    unique: true,
    where: '"deleted_at" IS NULL',
  },
)
export class PermissionTranslationEntity extends BaseEntity {
  @Column({ name: 'language', type: 'varchar', length: 100 })
  language: LanguageEnum;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'slug', type: 'varchar', length: 255 })
  slug: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ name: 'permission_id', type: 'int' })
  permissionId: number;

  @ManyToOne(() => PermissionEntity, (permission) => permission.translations, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;

  constructor(translation?: DeepPartial<PermissionTranslationEntity>) {
    super(translation);
    Object.assign(this, translation);
  }
}
