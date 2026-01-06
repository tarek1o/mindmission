import {
  Column,
  DeepPartial,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';
import { BaseEntity } from 'src/modules/shared/infrastructure/database/entities/base.entity';

@Entity({ name: 'role_translations' })
@Index(
  'role_translations_language_name_partial_unique_index',
  ['language', 'name'],
  {
    unique: true,
    where: '"deleted_at" IS NULL',
  },
)
export class RoleTranslationEntity extends BaseEntity {
  @Column({ name: 'language', type: 'varchar', length: 100 })
  language: LanguageEnum;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'slug', type: 'varchar', length: 255 })
  slug: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ name: 'role_id', type: 'int' })
  roleId: number;

  @ManyToOne(() => RoleEntity, (role) => role.translations, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  constructor(translation?: DeepPartial<RoleTranslationEntity>) {
    super(translation);
    Object.assign(this, translation);
  }
}
