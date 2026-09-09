import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import { TranslationsService } from "src/translations/translations.service";

import { CreateTranslationDto, PatchTranslationDto } from "src/translations/dto/translation.dto";

@Controller("translations")
export class TranslationsController {
  constructor(private readonly translations_service: TranslationsService) {}

  @Post()
  async add_one(@Body() translation: CreateTranslationDto) {
    return await this.translations_service.add_one(translation);
  }

  @Delete(":id")
  async remove_one(@Param("id") id: string) {
    return await this.translations_service.delete_one(id);
  }

  @Get()
  async get_all() {
    return await this.translations_service.get_all();
  }

  @Get(":id")
  async get_one(@Param("id") id: string) {
    return await this.translations_service.get_one(id);
  }

  @Patch(":id")
  async patch_one(@Param("id") id: string, @Body() updates: PatchTranslationDto) {
    return await this.translations_service.patch_one(id, updates);
  }
}
