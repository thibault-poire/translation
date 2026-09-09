import { randomUUID } from "crypto";

import { NotFoundException } from "@nestjs/common";

import { KeysController } from "src/keys/keys.controller";

import { KeysService } from "src/keys/keys.service";

import { Key } from "src/keys/entities/key.entity";
import { Project } from "src/projects/entities/project.entity";
import { Translation } from "src/translations/entities/translation.entity";

import { CreateKeyDto, PatchKeyDto } from "src/keys/dto/key.dto";

import type { DeleteResult, Repository } from "typeorm";

describe("KeysController", () => {
  let controller: KeysController;
  let service: KeysService;

  beforeEach(() => {
    service = new KeysService(
      {} as Repository<Key>,
      {} as Repository<Project>,
      {} as Repository<Translation>,
    );

    controller = new KeysController(service);
  });

  describe("add_one", () => {
    it("should return the created key", async () => {
      const dto = {
        name: "test",
      } as CreateKeyDto;

      const id = randomUUID();
      const new_key = { id } as Key;

      vi.spyOn(service, "add_one").mockResolvedValue(new_key);

      expect(await controller.add_one(dto)).toBe(new_key);
    });
  });

  describe("delete_one", () => {
    it("should return the correct deleted key depending on id", async () => {
      const id = randomUUID();
      const deleted_key = { raw: null } as DeleteResult;

      vi.spyOn(service, "delete_one").mockResolvedValue(deleted_key);

      expect(await controller.delete_one(id)).toBe(deleted_key);
    });

    it("should throw an error if the key is not found", async () => {
      const id = randomUUID();

      vi.spyOn(service, "delete_one").mockRejectedValue(new NotFoundException());

      await expect(controller.delete_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("get_all", () => {
    it("should return an array of keys", async () => {
      const keys = Array.apply({ length: 5 }).map(() => ({ id: randomUUID() }) as Key);

      vi.spyOn(service, "get_all").mockResolvedValue(keys);

      expect(await controller.get_all()).toBe(keys);
    });
  });

  describe("get_one", () => {
    it("should return the correct key depending on id", async () => {
      const id = randomUUID();
      const key = { id } as Key;

      vi.spyOn(service, "get_one").mockResolvedValue(key);

      expect(await controller.get_one(id)).toBe(key);
    });

    it("should throw an error if the key is not found", async () => {
      const id = randomUUID();

      vi.spyOn(service, "get_one").mockRejectedValue(new NotFoundException());

      await expect(controller.get_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should return the correct updated key depending on id", async () => {
      const id = randomUUID();
      const key = { id } as Key;
      const to_update_key = {} as PatchKeyDto;

      vi.spyOn(service, "patch_one").mockResolvedValue(key);

      expect(await controller.patch_one(id, to_update_key)).toBe(key);
    });

    it("should throw an error if the key is not found", async () => {
      const id = randomUUID();
      const to_update_key = {} as PatchKeyDto;

      vi.spyOn(service, "patch_one").mockRejectedValue(new NotFoundException());

      await expect(controller.patch_one(id, to_update_key)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
