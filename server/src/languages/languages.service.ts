import { In, Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Language } from "src/languages/entities/language.entity";
import { Project } from "src/projects/entities/project.entity";
import { Translation } from "src/translations/entities/translation.entity";

import { CreateLanguageDto, PatchLanguageDto } from "src/languages/dto/language.dto";

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly language_repository: Repository<Language>,
    @InjectRepository(Project)
    private readonly project_repository: Repository<Project>,
    @InjectRepository(Translation)
    private readonly translation_repository: Repository<Translation>,
  ) {}

  async add_one({ project_ids, translation_ids, ...properties }: CreateLanguageDto) {
    const projects = project_ids
      ? {
          projects: await this.project_repository.findBy({
            id: In(project_ids),
          }),
        }
      : {};

    const translations = translation_ids
      ? {
          translations: await this.translation_repository.findBy({
            id: In(translation_ids),
          }),
        }
      : {};

    return await this.language_repository.save({
      ...properties,
      ...projects,
      ...translations,
    });
  }

  async delete_one(id: string) {
    return this.language_repository.delete(id);
  }

  async get_all() {
    return await this.language_repository.find({
      relations: { projects: true, translations: true },
    });
  }

  async get_one(id: string) {
    const language = await this.language_repository.findOne({
      where: { id },
      relations: { projects: true, translations: true },
    });

    if (!language) {
      throw new NotFoundException();
    }

    return language;
  }

  async patch_one(id: string, { project_ids, translation_ids, ...updates }: PatchLanguageDto) {
    const language = await this.language_repository.findOne({
      where: { id },
      relations: { projects: true, translations: true },
    });

    if (!language) {
      throw new NotFoundException();
    }

    const projects = project_ids
      ? {
          projects: await this.project_repository.findBy({
            id: In(project_ids),
          }),
        }
      : {};

    const translations = translation_ids
      ? {
          translations: await this.translation_repository.findBy({
            id: In(translation_ids),
          }),
        }
      : {};

    return await this.language_repository.save({
      ...language,
      ...updates,
      ...projects,
      ...translations,
    });
  }
}
