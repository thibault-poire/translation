import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Key } from "src/keys/entities/key.entity";
import { Language } from "src/languages/entities/language.entity";
import { Translation } from "src/translations/entities/translation.entity";

import type {
  CreateTranslationDto,
  PatchTranslationDto,
} from "src/translations/dto/translation.dto";

import type { Repository } from "typeorm";

@Injectable()
export class TranslationsService {
  constructor(
    @InjectRepository(Translation)
    private readonly translation_repository: Repository<Translation>,
    @InjectRepository(Key)
    private readonly key_repository: Repository<Key>,
    @InjectRepository(Language)
    private readonly language_repository: Repository<Language>,
  ) {}

  async add_one({ key_id, language_id, ...properties }: CreateTranslationDto) {
    const key = key_id ? { key: (await this.key_repository.findOneBy({ id: key_id })) ?? {} } : {};

    const language = language_id
      ? {
          language:
            (await this.language_repository.findOneBy({
              id: language_id,
            })) ?? {},
        }
      : {};

    return await this.translation_repository.save({
      ...properties,
      ...language,
      ...key,
    });
  }

  async delete_one(id: string) {
    return await this.translation_repository.delete(id);
  }

  async get_all() {
    return await this.translation_repository.find({ relations: { key: true } });
  }

  async get_one(id: string) {
    const translation = await this.translation_repository.findOne({
      where: { id },
      relations: { key: true },
    });

    if (!translation) {
      throw new NotFoundException();
    }

    return translation;
  }

  async patch_one(id: string, { key_id, language_id, ...updates }: PatchTranslationDto) {
    const translation = await this.translation_repository.findOne({
      where: { id },
      relations: { key: true },
    });

    if (!translation) {
      throw new NotFoundException();
    }

    const key = key_id ? { key: (await this.key_repository.findOneBy({ id: key_id })) ?? {} } : {};

    const language = language_id
      ? {
          language:
            (await this.language_repository.findOneBy({
              id: language_id,
            })) ?? {},
        }
      : {};

    return await this.translation_repository.save({
      ...translation,
      ...updates,
      ...language,
      ...key,
    });
  }
}
