import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import { LanguagesService } from "src/languages/languages.service";

import { CreateLanguageDto, PatchLanguageDto } from "src/languages/dto/language.dto";

@Controller("languages")
export class LanguagesController {
  constructor(private readonly language_service: LanguagesService) {}

  @Post()
  async add_one(@Body() language: CreateLanguageDto) {
    return await this.language_service.add_one(language);
  }

  @Delete(":id")
  async remove_one(@Param("id") id: string) {
    return await this.language_service.delete_one(id);
  }

  @Get()
  async get_all() {
    return await this.language_service.get_all();
  }

  @Get(":id")
  async get_one(@Param("id") id: string) {
    return await this.language_service.get_one(id);
  }

  @Patch(":id")
  async patch_one(@Param("id") id: string, @Body() updates: PatchLanguageDto) {
    return await this.language_service.patch_one(id, updates);
  }
}
