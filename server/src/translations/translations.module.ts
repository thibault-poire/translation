import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Translation } from "src/translations/entities/translation.entity";
import { TranslationsController } from "src/translations/translations.controller";
import { TranslationsService } from "src/translations/translations.service";

@Module({
  imports: [TypeOrmModule.forFeature([Translation])],
  controllers: [TranslationsController],
  providers: [TranslationsService],
})
export class TranslationsModule {}
