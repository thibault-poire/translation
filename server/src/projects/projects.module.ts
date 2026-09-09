import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProjectsController } from "src/projects/projects.controller";

import { ProjectsService } from "src/projects/projects.service";

import { Key } from "src/keys/entities/key.entity";
import { Language } from "src/languages/entities/language.entity";
import { Project } from "src/projects/entities/project.entity";
import { Team } from "src/teams/entities/team.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Project, Language, Team, Key])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
