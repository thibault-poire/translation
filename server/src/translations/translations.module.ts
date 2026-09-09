import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TranslationsController } from "src/translations/translations.controller";

import { TranslationsService } from "src/translations/translations.service";

import { Key } from "src/keys/entities/key.entity";
import { Language } from "src/languages/entities/language.entity";
import { Translation } from "src/translations/entities/translation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Translation, Key, Language])],
  controllers: [TranslationsController],
  providers: [TranslationsService],
})
export class TranslationsModule {}
