import { randomUUID } from "crypto";
import { In } from "typeorm";

import { NotFoundException } from "@nestjs/common";

import { KeysService } from "src/keys/keys.service";

import { Key } from "src/keys/entities/key.entity";
import { Project } from "src/projects/entities/project.entity";
import { Translation } from "src/translations/entities/translation.entity";

import { CreateKeyDto, PatchKeyDto } from "src/keys/dto/key.dto";

import type { DeleteResult, ObjectLiteral, Repository } from "typeorm";

describe("KeysService", () => {
  const repository_mock = <T extends ObjectLiteral>() =>
    ({
      delete: vi.fn(),
      find: vi.fn(),
      findBy: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      save: vi.fn(),
    }) as unknown as Repository<T>;

  let service: KeysService;
  let key_repository: Repository<Key>;
  let project_repository: Repository<Project>;
  let translation_repository: Repository<Translation>;

  beforeEach(() => {
    key_repository = repository_mock<Key>();
    project_repository = repository_mock<Project>();
    translation_repository = repository_mock<Translation>();

    service = new KeysService(key_repository, project_repository, translation_repository);
  });

  describe("add_one", () => {
    it("should return the saved key with project and translations relations", async () => {
      const project_id = randomUUID();
      const translation_id = randomUUID();
      const key = { name: "test" } as Key;
      const project = { id: project_id } as Project;
      const translation = { id: translation_id } as Translation;
      const updates = { project_id, translation_ids: [translation_id] } as CreateKeyDto;

      vi.mocked(project_repository.findOneBy).mockResolvedValue(project);
      vi.mocked(translation_repository.findBy).mockResolvedValue([translation]);
      vi.mocked(key_repository.save).mockResolvedValue(key);

      expect(await service.add_one(updates)).toBe(key);
      expect(project_repository.findOneBy).toHaveBeenCalledWith({ id: project_id });

      expect(translation_repository.findBy).toHaveBeenCalledWith({
        id: In([translation_id]),
      });

      expect(key_repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ project, translations: [translation] }),
      );
    });
  });

  describe("get_all", () => {
    it("should return all keys with translations", async () => {
      const keys = [{ id: randomUUID() }, { id: randomUUID() }] as Key[];

      vi.mocked(key_repository.find).mockResolvedValue(keys);

      expect(await service.get_all()).toBe(keys);

      expect(key_repository.find).toHaveBeenCalledWith({
        relations: { translations: true },
      });
    });
  });

  describe("get_one", () => {
    it("should return the matching key with translations", async () => {
      const id = randomUUID();
      const key = { id } as Key;

      vi.mocked(key_repository.findOne).mockResolvedValue(key);

      expect(await service.get_one(id)).toBe(key);

      expect(key_repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { translations: true },
      });
    });

    it("should throw an error if key is not found", async () => {
      const id = randomUUID();

      vi.mocked(key_repository.findOne).mockResolvedValue(null);

      await expect(service.get_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should update the key and apply project and translation relations", async () => {
      const id = randomUUID();
      const project_id = randomUUID();
      const translation_id = randomUUID();
      const key = { id } as Key;
      const project = { id: project_id } as Project;
      const translation = { id: translation_id } as Translation;

      const updates = {
        name: "example",
        project_id,
        translation_ids: [translation_id],
      } as PatchKeyDto;

      const saved_key = { id } as Key;

      vi.mocked(key_repository.findOne).mockResolvedValue(key);
      vi.mocked(project_repository.findOneBy).mockResolvedValue(project);
      vi.mocked(translation_repository.findBy).mockResolvedValue([translation]);
      vi.mocked(key_repository.save).mockResolvedValue(saved_key);

      expect(await service.patch_one(id, updates)).toBe(saved_key);

      expect(key_repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { project: true, translations: true },
      });

      expect(project_repository.findOneBy).toHaveBeenCalled();
      expect(translation_repository.findBy).toHaveBeenCalled();
      expect(key_repository.save).toHaveBeenCalled();
    });

    it("should throw an error if key is not found", async () => {
      const id = randomUUID();
      const updates = { name: "test" } as PatchKeyDto;

      vi.mocked(key_repository.findOne).mockResolvedValue(null);

      await expect(service.patch_one(id, updates)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("delete_one", () => {
    it("should return deleted key", async () => {
      const id = randomUUID();
      const key = { id } as Key;
      const deleted_key = { raw: null } as DeleteResult;

      vi.mocked(key_repository.findOne).mockResolvedValue(key);
      vi.mocked(key_repository.delete).mockResolvedValue(deleted_key);

      expect(await service.delete_one(id)).toBe(deleted_key);

      expect(key_repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });

      expect(key_repository.delete).toHaveBeenCalledWith(id);
    });

    it("should throw an error if key is not found", async () => {
      const id = randomUUID();

      vi.mocked(key_repository.findOne).mockResolvedValue(null);

      await expect(service.delete_one(id)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
