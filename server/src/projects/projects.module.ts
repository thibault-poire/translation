import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Key } from "src/keys/entities/key.entity";
import { Project } from "src/projects/entities/project.entity";
import { ProjectsController } from "src/projects/projects.controller";
import { ProjectsService } from "src/projects/projects.service";
import { Team } from "src/teams/entities/team.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Project, Team, Key])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
