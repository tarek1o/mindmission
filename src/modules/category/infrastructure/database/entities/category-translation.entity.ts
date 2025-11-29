import { Column, DeepPartial, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "src/modules/shared/infrastructure/database/entities/base.entity";
import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";
import { CategoryEntity } from "./category.entity";

@Entity({ name: 'category_translations' })
export class CategoryTranslationEntity extends BaseEntity {
  @Column({ name: 'language', type: 'varchar', length: 100 })
  language: LanguageEnum;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'slug', type: 'varchar', length: 255 })
  slug: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @ManyToOne(() => CategoryEntity, category => category.translations, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  constructor(translation?: DeepPartial<CategoryTranslationEntity>) {
    super(translation);
    Object.assign(this, translation);
  }
}