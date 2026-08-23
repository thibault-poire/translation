import { Controller } from "@nestjs/common";

import { TranslationsService } from "src/translations/translations.service";

@Controller("translations")
export class TranslationsController {
  constructor(private readonly translations_service: TranslationsService) {}
}
