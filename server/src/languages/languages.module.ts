import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Language } from "src/languages/entities/language.entity";
import { LanguagesController } from "src/languages/languages.controller";
import { LanguagesService } from "src/languages/languages.service";

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [LanguagesController],
  providers: [LanguagesService],
})
export class LanguagesModule {}
