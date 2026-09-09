import { randomUUID } from "crypto";

import { NotFoundException } from "@nestjs/common";

import { TranslationsService } from "src/translations/translations.service";

import { Key } from "src/keys/entities/key.entity";
import { Language } from "src/languages/entities/language.entity";
import { Translation } from "src/translations/entities/translation.entity";

import { CreateTranslationDto, PatchTranslationDto } from "src/translations/dto/translation.dto";

import type { DeleteResult, ObjectLiteral, Repository } from "typeorm";

describe("TranslationsService", () => {
  const repository_mock = <T extends ObjectLiteral>() =>
    ({
      delete: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      save: vi.fn(),
    }) as unknown as Repository<T>;

  let service: TranslationsService;
  let translation_repository: Repository<Translation>;
  let key_repository: Repository<Key>;
  let language_repository: Repository<Language>;

  beforeEach(() => {
    translation_repository = repository_mock<Translation>();
    key_repository = repository_mock<Key>();
    language_repository = repository_mock<Language>();

    service = new TranslationsService(translation_repository, key_repository, language_repository);
  });

  describe("add_one", () => {
    it("should return the saved translation with key and language relations", async () => {
      const key_id = randomUUID();
      const language_id = randomUUID();
      const key = { id: key_id } as Key;
      const language = { id: language_id } as Language;
      const translation = { value: "test" } as Translation;

      const updates = {
        value: "test",
        key_id,
        language_id,
      } as CreateTranslationDto;

      vi.mocked(key_repository.findOneBy).mockResolvedValue(key);
      vi.mocked(language_repository.findOneBy).mockResolvedValue(language);
      vi.mocked(translation_repository.save).mockResolvedValue(translation);

      expect(await service.add_one(updates)).toBe(translation);
      expect(key_repository.findOneBy).toHaveBeenCalledWith({ id: key_id });
      expect(language_repository.findOneBy).toHaveBeenCalledWith({ id: language_id });

      expect(translation_repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          value: "test",
          key,
          language,
        }),
      );
    });
  });

  describe("get_all", () => {
    it("should return all translations with key relation", async () => {
      const translations = [{ id: randomUUID() }, { id: randomUUID() }] as Translation[];

      vi.mocked(translation_repository.find).mockResolvedValue(translations);

      expect(await service.get_all()).toBe(translations);

      expect(translation_repository.find).toHaveBeenCalledWith({
        relations: { key: true },
      });
    });
  });

  describe("get_one", () => {
    it("should return the matching translation with key relation", async () => {
      const id = randomUUID();
      const translation = { id } as Translation;

      vi.mocked(translation_repository.findOne).mockResolvedValue(translation);

      expect(await service.get_one(id)).toBe(translation);

      expect(translation_repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { key: true },
      });
    });

    it("should throw an error if translation is not found", async () => {
      const id = randomUUID();

      vi.mocked(translation_repository.findOne).mockResolvedValue(null);

      await expect(service.get_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should update the translation and apply key and language relations", async () => {
      const id = randomUUID();
      const key_id = randomUUID();
      const language_id = randomUUID();
      const translation = { id } as Translation;
      const key = { id: key_id } as Key;
      const language = { id: language_id } as Language;

      const updates = {
        value: "updated",
        key_id,
        language_id,
      } as PatchTranslationDto;

      const saved_translation = { id } as Translation;

      vi.mocked(translation_repository.findOne).mockResolvedValue(translation);
      vi.mocked(key_repository.findOneBy).mockResolvedValue(key);
      vi.mocked(language_repository.findOneBy).mockResolvedValue(language);
      vi.mocked(translation_repository.save).mockResolvedValue(saved_translation);

      expect(await service.patch_one(id, updates)).toBe(saved_translation);

      expect(translation_repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { key: true },
      });

      expect(key_repository.findOneBy).toHaveBeenCalledWith({ id: key_id });
      expect(language_repository.findOneBy).toHaveBeenCalledWith({ id: language_id });
      expect(translation_repository.save).toHaveBeenCalled();
    });

    it("should throw an error if translation is not found", async () => {
      const id = randomUUID();
      const updates = { value: "test" } as PatchTranslationDto;

      vi.mocked(translation_repository.findOne).mockResolvedValue(null);

      await expect(service.patch_one(id, updates)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("delete_one", () => {
    it("should return deleted translation", async () => {
      const id = randomUUID();
      const deleted_translation = { raw: null } as DeleteResult;

      vi.mocked(translation_repository.delete).mockResolvedValue(deleted_translation);

      expect(await service.delete_one(id)).toBe(deleted_translation);

      expect(translation_repository.delete).toHaveBeenCalledWith(id);
    });
  });
});
