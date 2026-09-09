import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import { KeysService } from "src/keys/keys.service";

import { CreateKeyDto, PatchKeyDto } from "src/keys/dto/key.dto";

@Controller("keys")
export class KeysController {
  constructor(private readonly keys_service: KeysService) {}

  @Post()
  async add_one(@Body() key: CreateKeyDto) {
    return await this.keys_service.add_one(key);
  }

  @Delete(":id")
  async delete_one(@Param("id") id: string) {
    return await this.keys_service.delete_one(id);
  }

  @Get()
  async get_all() {
    return await this.keys_service.get_all();
  }

  @Get(":id")
  async get_one(@Param("id") id: string) {
    return await this.keys_service.get_one(id);
  }

  @Patch(":id")
  async patch_one(@Param("id") id: string, @Body() updates: PatchKeyDto) {
    return await this.keys_service.patch_one(id, updates);
  }
}
