import { Controller, Get } from "@nestjs/common";

import { LanguagesService } from "src/languages/languages.service";

@Controller("languages")
export class LanguagesController {
  constructor(private readonly language_service: LanguagesService) {}

  @Get()
  async get_all() {
    return this.language_service.get_all();
  }
}
