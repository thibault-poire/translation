import { randomUUID } from "crypto";

import { NotFoundException } from "@nestjs/common";

import { LanguagesController } from "src/languages/languages.controller";

import { LanguagesService } from "src/languages/languages.service";

import { Language } from "src/languages/entities/language.entity";
import { Project } from "src/projects/entities/project.entity";
import { Translation } from "src/translations/entities/translation.entity";

import { CreateLanguageDto, PatchLanguageDto } from "src/languages/dto/language.dto";

import type { DeleteResult, Repository } from "typeorm";

describe("LanguagesController", () => {
  let controller: LanguagesController;
  let service: LanguagesService;

  beforeEach(() => {
    service = new LanguagesService(
      {} as Repository<Language>,
      {} as Repository<Project>,
      {} as Repository<Translation>,
    );

    controller = new LanguagesController(service);
  });

  describe("add_one", () => {
    it("should return the created language", async () => {
      const dto = {
        language_tag: "en-US",
      } as CreateLanguageDto;

      const id = randomUUID();
      const new_language = { id } as Language;

      vi.spyOn(service, "add_one").mockResolvedValue(new_language);

      expect(await controller.add_one(dto)).toBe(new_language);
    });
  });

  describe("delete_one", () => {
    it("should return the correct deleted language depending on id", async () => {
      const id = randomUUID();
      const deleted_language = { raw: null } as DeleteResult;

      vi.spyOn(service, "delete_one").mockResolvedValue(deleted_language);

      expect(await controller.remove_one(id)).toBe(deleted_language);
    });

    it("should throw an error if the language is not found", async () => {
      const id = randomUUID();

      vi.spyOn(service, "delete_one").mockRejectedValue(new NotFoundException());

      await expect(controller.remove_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("get_all", () => {
    it("should return an array of languages", async () => {
      const languages = Array.apply({ length: 5 }).map(() => ({ id: randomUUID() }) as Language);

      vi.spyOn(service, "get_all").mockResolvedValue(languages);

      expect(await controller.get_all()).toBe(languages);
    });
  });

  describe("get_one", () => {
    it("should return the correct language depending on id", async () => {
      const id = randomUUID();
      const language = { id } as Language;

      vi.spyOn(service, "get_one").mockResolvedValue(language);

      expect(await controller.get_one(id)).toBe(language);
    });

    it("should throw an error if the language is not found", async () => {
      const id = randomUUID();

      vi.spyOn(service, "get_one").mockRejectedValue(new NotFoundException());

      await expect(controller.get_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should return the correct updated language depending on id", async () => {
      const id = randomUUID();
      const language = { id } as Language;
      const to_update_language = {} as PatchLanguageDto;

      vi.spyOn(service, "patch_one").mockResolvedValue(language);

      expect(await controller.patch_one(id, to_update_language)).toBe(language);
    });

    it("should throw an error if the language is not found", async () => {
      const id = randomUUID();
      const to_update_language = {} as PatchLanguageDto;

      vi.spyOn(service, "patch_one").mockRejectedValue(new NotFoundException());

      await expect(controller.patch_one(id, to_update_language)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
