import { In, Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Key } from "src/keys/entities/key.entity";
import { Language } from "src/languages/entities/language.entity";
import { Project } from "src/projects/entities/project.entity";
import { Team } from "src/teams/entities/team.entity";

import { CreateProjectDto, PatchProjectDto } from "src/projects/dto/project.dto";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly project_repository: Repository<Project>,
    @InjectRepository(Language)
    private readonly language_repository: Repository<Language>,
    @InjectRepository(Team)
    private readonly team_repository: Repository<Team>,
    @InjectRepository(Key)
    private readonly key_repository: Repository<Key>,
  ) {}

  async add_one({ default_language_id, team_ids, key_ids, ...properties }: CreateProjectDto) {
    const default_language = default_language_id
      ? {
          default_language:
            (await this.language_repository.findOneBy({
              id: default_language_id,
            })) ?? {},
        }
      : {};

    const teams = team_ids?.length
      ? { teams: await this.team_repository.findBy({ id: In(team_ids) }) }
      : {};

    const keys = key_ids?.length
      ? { keys: await this.key_repository.findBy({ id: In(key_ids) }) }
      : {};

    return await this.project_repository.save({
      ...properties,
      ...default_language,
      ...teams,
      ...keys,
    });
  }

  async delete_one(id: string) {
    return this.project_repository.delete(id);
  }

  async get_all() {
    return await this.project_repository.find({
      relations: { default_language: true, teams: true },
    });
  }

  async get_one(id: string) {
    const project = await this.project_repository.findOne({
      where: { id },
      relations: { default_language: true, teams: true },
    });

    if (!project) {
      throw new NotFoundException();
    }

    return project;
  }

  async patch_one(
    id: string,
    { default_language_id, team_ids, key_ids, ...updates }: PatchProjectDto,
  ) {
    const project = await this.project_repository.findOne({
      where: { id },
      relations: { teams: true, keys: true },
    });

    if (!project) {
      throw new NotFoundException();
    }

    const default_language = default_language_id
      ? {
          default_language:
            (await this.language_repository.findOneBy({
              id: default_language_id,
            })) ?? {},
        }
      : {};

    const teams = team_ids?.length
      ? { teams: await this.team_repository.findBy({ id: In(team_ids) }) }
      : {};

    const keys = key_ids?.length
      ? { keys: await this.key_repository.findBy({ id: In(key_ids) }) }
      : {};

    return await this.project_repository.save({
      ...project,
      ...updates,
      ...default_language,
      ...teams,
      ...keys,
    });
  }
}
