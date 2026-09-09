import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";

import { Key } from "src/keys/entities/key.entity";
import { Language } from "src/languages/entities/language.entity";
import { Team } from "src/teams/entities/team.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255, unique: true })
  name: string;

  @ManyToOne(() => Language, (language) => language.projects)
  @JoinColumn({ name: "default_language_id" })
  default_language: Language;

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

  @ManyToMany(() => Team, (team) => team.projects)
  @JoinTable({
    name: "project_team",
    joinColumn: {
      name: "project_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "team_id",
      referencedColumnName: "id",
    },
  })
  teams: Team[];

  @OneToMany(() => Key, (key) => key.project)
  keys: Key[];
}
