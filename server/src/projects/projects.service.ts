import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { In, Repository } from "typeorm";

import { Key } from "src/keys/entities/key.entity";
import {
  CreateProjectDto,
  type PatchProjectDto,
} from "src/projects/dto/project.dto";
import { Project } from "src/projects/entities/project.entity";
import { Team } from "src/teams/entities/team.entity";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly project_repository: Repository<Project>,
    @InjectRepository(Team)
    private readonly team_repository: Repository<Team>,
    @InjectRepository(Key)
    private readonly key_repository: Repository<Key>,
  ) {}

  async add_one({ team_ids, key_ids, ...properties }: CreateProjectDto) {
    const teams = team_ids?.length
      ? { teams: await this.team_repository.findBy({ id: In(team_ids) }) }
      : {};

    const keys = key_ids?.length
      ? { keys: await this.key_repository.findBy({ id: In(key_ids) }) }
      : {};

    return await this.team_repository.save({
      ...properties,
      ...teams,
      ...keys,
    });
  }

  async delete_one(id: number) {
    return this.project_repository.delete(id);
  }

  async get_all() {
    const projects = await this.project_repository.find({
      relations: { teams: true },
    });

    return projects;
  }

  async get_one(id: number) {
    const project = await this.project_repository.findOne({
      where: { id },
      relations: { teams: true },
    });

    if (!project) {
      throw new NotFoundException();
    }

    return project;
  }

  async patch_one(
    id: number,
    { team_ids, key_ids, ...updates }: PatchProjectDto,
  ) {
    const project = await this.project_repository.findOne({
      where: { id },
      relations: { teams: true, keys: true },
    });

    if (!project) {
      throw new NotFoundException();
    }

    const teams = team_ids?.length
      ? { teams: await this.team_repository.findBy({ id: In(team_ids) }) }
      : {};

    const keys = key_ids?.length
      ? { keys: await this.key_repository.findBy({ id: In(key_ids) }) }
      : {};

    return await this.team_repository.save({
      ...project,
      ...updates,
      ...teams,
      ...keys,
    });
  }
}
