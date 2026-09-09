import { randomUUID } from "crypto";

import { NotFoundException } from "@nestjs/common";

import { TranslationsController } from "src/translations/translations.controller";

import { TranslationsService } from "src/translations/translations.service";

import { Key } from "src/keys/entities/key.entity";
import { Language } from "src/languages/entities/language.entity";
import { Translation } from "src/translations/entities/translation.entity";

import { CreateTranslationDto, PatchTranslationDto } from "src/translations/dto/translation.dto";

import type { DeleteResult, Repository } from "typeorm";

describe("TranslationsController", () => {
  let controller: TranslationsController;
  let service: TranslationsService;

  beforeEach(() => {
    service = new TranslationsService(
      {} as Repository<Translation>,
      {} as Repository<Key>,
      {} as Repository<Language>,
    );

    controller = new TranslationsController(service);
  });

  describe("add_one", () => {
    it("should return the created translation", async () => {
      const dto = {
        value: "test",
        key_id: randomUUID(),
        language_id: randomUUID(),
      } as CreateTranslationDto;

      const new_translation = { id: randomUUID() } as Translation;

      vi.spyOn(service, "add_one").mockResolvedValue(new_translation);

      expect(await controller.add_one(dto)).toBe(new_translation);
    });
  });

  describe("delete_one", () => {
    it("should return the correct deleted translation depending on id", async () => {
      const id = randomUUID();
      const deleted_translation = { raw: null } as DeleteResult;

      vi.spyOn(service, "delete_one").mockResolvedValue(deleted_translation);

      expect(await controller.remove_one(id)).toBe(deleted_translation);
    });

    it("should throw an error if the translation is not found", async () => {
      const id = randomUUID();

      vi.spyOn(service, "delete_one").mockRejectedValue(new NotFoundException());

      await expect(controller.remove_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("get_all", () => {
    it("should return an array of translations", async () => {
      const translations = Array.apply({ length: 5 }).map(
        () => ({ id: randomUUID() }) as Translation,
      );

      vi.spyOn(service, "get_all").mockResolvedValue(translations);

      expect(await controller.get_all()).toBe(translations);
    });
  });

  describe("get_one", () => {
    it("should return the correct translation depending on id", async () => {
      const id = randomUUID();
      const translation = { id } as Translation;

      vi.spyOn(service, "get_one").mockResolvedValue(translation);

      expect(await controller.get_one(id)).toBe(translation);
    });

    it("should throw an error if the translation is not found", async () => {
      const id = randomUUID();

      vi.spyOn(service, "get_one").mockRejectedValue(new NotFoundException());

      await expect(controller.get_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should return the correct updated translation depending on id", async () => {
      const id = randomUUID();
      const translation = { id } as Translation;
      const to_update_translation = {} as PatchTranslationDto;

      vi.spyOn(service, "patch_one").mockResolvedValue(translation);

      expect(await controller.patch_one(id, to_update_translation)).toBe(translation);
    });

    it("should throw an error if the translation is not found", async () => {
      const id = randomUUID();
      const to_update_translation = {} as PatchTranslationDto;

      vi.spyOn(service, "patch_one").mockRejectedValue(new NotFoundException());

      await expect(controller.patch_one(id, to_update_translation)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
