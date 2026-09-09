import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { Project } from "src/projects/entities/project.entity";
import { Translation } from "src/translations/entities/translation.entity";

@Entity()
export class Language {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 5, unique: true })
  language_tag: string;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "now()",
  })
  created_at: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    default: () => "now()",
  })
  updated_at: Date;

  @OneToMany(() => Project, (project) => project.default_language)
  projects: Project[];

  @OneToMany(() => Translation, (translation) => translation.language, {
    cascade: true,
  })
  translations: Translation[];
}
