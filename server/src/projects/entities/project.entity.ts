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
} from "typeorm";

import { Key } from "src/keys/entities/key.entity";
import { Team } from "src/teams/entities/team.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name: string;

  @Column({ length: 5 })
  default_language_tag: string;

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
  @JoinColumn({ name: "key_id" })
  keys: Key[];
}
