import { randomUUID } from "crypto";
import { In } from "typeorm";

import { NotFoundException } from "@nestjs/common";

import { LanguagesService } from "src/languages/languages.service";

import { Language } from "src/languages/entities/language.entity";
import { Project } from "src/projects/entities/project.entity";
import { Translation } from "src/translations/entities/translation.entity";

import { CreateLanguageDto, PatchLanguageDto } from "src/languages/dto/language.dto";

import type { DeleteResult, ObjectLiteral, Repository } from "typeorm";

describe("LanguagesService", () => {
  const repository_mock = <T extends ObjectLiteral>() =>
    ({
      delete: vi.fn(),
      find: vi.fn(),
      findBy: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      save: vi.fn(),
    }) as unknown as Repository<T>;

  let service: LanguagesService;
  let language_repository: Repository<Language>;
  let project_repository: Repository<Project>;
  let translation_repository: Repository<Translation>;

  beforeEach(() => {
    language_repository = repository_mock<Language>();
    project_repository = repository_mock<Project>();
    translation_repository = repository_mock<Translation>();

    service = new LanguagesService(language_repository, project_repository, translation_repository);
  });

  describe("add_one", () => {
    it("should return the saved language with project and translation relations", async () => {
      const project_id = randomUUID();
      const translation_id = randomUUID();
      const language = { language_tag: "en-US" } as Language;
      const project = { id: project_id } as Project;
      const translation = { id: translation_id } as Translation;

      const updates = {
        language_tag: "en-US",
        project_ids: [project_id],
        translation_ids: [translation_id],
      } as CreateLanguageDto;

      vi.mocked(project_repository.findBy).mockResolvedValue([project]);
      vi.mocked(translation_repository.findBy).mockResolvedValue([translation]);
      vi.mocked(language_repository.save).mockResolvedValue(language);

      expect(await service.add_one(updates)).toBe(language);

      expect(project_repository.findBy).toHaveBeenCalledWith({
        id: In([project_id]),
      });

      expect(translation_repository.findBy).toHaveBeenCalledWith({
        id: In([translation_id]),
      });

      expect(language_repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          language_tag: "en-US",
          projects: [project],
          translations: [translation],
        }),
      );
    });
  });

  describe("get_all", () => {
    it("should return all languages with projects and translations", async () => {
      const languages = [{ id: randomUUID() }, { id: randomUUID() }] as Language[];

      vi.mocked(language_repository.find).mockResolvedValue(languages);

      expect(await service.get_all()).toBe(languages);

      expect(language_repository.find).toHaveBeenCalledWith({
        relations: { projects: true, translations: true },
      });
    });
  });

  describe("get_one", () => {
    it("should return the matching language with projects and translations", async () => {
      const id = randomUUID();
      const language = { id } as Language;

      vi.mocked(language_repository.findOne).mockResolvedValue(language);

      expect(await service.get_one(id)).toBe(language);

      expect(language_repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { projects: true, translations: true },
      });
    });

    it("should throw an error if language is not found", async () => {
      const id = randomUUID();

      vi.mocked(language_repository.findOne).mockResolvedValue(null);

      await expect(service.get_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should update the language and apply project and translation relations", async () => {
      const id = randomUUID();
      const project_id = randomUUID();
      const translation_id = randomUUID();
      const language = { id } as Language;
      const project = { id: project_id } as Project;
      const translation = { id: translation_id } as Translation;

      const updates = {
        language_tag: "fr-FR",
        project_ids: [project_id],
        translation_ids: [translation_id],
      } as PatchLanguageDto;

      const saved_language = { id } as Language;

      vi.mocked(language_repository.findOne).mockResolvedValue(language);
      vi.mocked(project_repository.findBy).mockResolvedValue([project]);
      vi.mocked(translation_repository.findBy).mockResolvedValue([translation]);
      vi.mocked(language_repository.save).mockResolvedValue(saved_language);

      expect(await service.patch_one(id, updates)).toBe(saved_language);

      expect(language_repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { projects: true, translations: true },
      });

      expect(project_repository.findBy).toHaveBeenCalledWith({
        id: In([project_id]),
      });

      expect(translation_repository.findBy).toHaveBeenCalledWith({
        id: In([translation_id]),
      });

      expect(language_repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          language_tag: "fr-FR",
          projects: [project],
          translations: [translation],
        }),
      );
    });

    it("should throw an error if language is not found", async () => {
      const id = randomUUID();
      const updates = { language_tag: "en-US" } as PatchLanguageDto;

      vi.mocked(language_repository.findOne).mockResolvedValue(null);

      await expect(service.patch_one(id, updates)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("delete_one", () => {
    it("should return deleted language", async () => {
      const id = randomUUID();
      const deleted_language = { raw: null } as DeleteResult;

      vi.mocked(language_repository.delete).mockResolvedValue(deleted_language);

      expect(await service.delete_one(id)).toBe(deleted_language);

      expect(language_repository.delete).toHaveBeenCalledWith(id);
    });
  });
});
