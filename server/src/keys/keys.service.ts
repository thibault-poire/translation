import { In, type Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Key } from "src/keys/entities/key.entity";
import { Project } from "src/projects/entities/project.entity";
import { Translation } from "src/translations/entities/translation.entity";

import type { CreateKeyDto, PatchKeyDto } from "src/keys/dto/key.dto";

@Injectable()
export class KeysService {
  constructor(
    @InjectRepository(Key)
    private readonly key_repository: Repository<Key>,
    @InjectRepository(Project)
    private readonly project_repository: Repository<Project>,
    @InjectRepository(Translation)
    private readonly translation_repository: Repository<Translation>,
  ) {}

  async add_one({ project_id, translation_ids, ...properties }: CreateKeyDto) {
    const project = project_id
      ? {
          project: (await this.project_repository.findOneBy({ id: project_id })) ?? {},
        }
      : {};

    const translations = translation_ids?.length
      ? {
          translations: await this.translation_repository.findBy({
            id: In(translation_ids),
          }),
        }
      : {};

    return await this.key_repository.save({
      ...properties,
      ...project,
      ...translations,
    });
  }

  async delete_one(id: string) {
    const key = await this.key_repository.findOne({
      where: { id },
    });

    if (!key) {
      throw new NotFoundException();
    }

    return await this.key_repository.delete(id);
  }

  async get_all() {
    return await this.key_repository.find({
      relations: { translations: true },
    });
  }

  async get_one(id: string) {
    const team = await this.key_repository.findOne({
      where: { id },
      relations: { translations: true },
    });

    if (!team) {
      throw new NotFoundException();
    }

    return team;
  }

  async patch_one(id: string, { project_id, translation_ids, ...updates }: PatchKeyDto) {
    const key = await this.key_repository.findOne({
      where: { id },
      relations: { project: true, translations: true },
    });

    if (!key) {
      throw new NotFoundException();
    }

    const project = project_id
      ? {
          project: (await this.project_repository.findOneBy({ id: project_id })) ?? {},
        }
      : {};

    const translations = translation_ids?.length
      ? {
          translations: await this.translation_repository.findBy({
            id: In(translation_ids),
          }),
        }
      : {};

    return await this.key_repository.save({
      ...key,
      ...updates,
      ...project,
      ...translations,
    });
  }
}
