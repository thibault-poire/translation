import { IsArray, IsNotEmpty, IsOptional, IsUUID, Length } from "class-validator";

export class CreateLanguageDto {
  @IsNotEmpty()
  @Length(5)
  language_tag: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  project_ids: string[];

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  translation_ids: string[];
}

export class PatchLanguageDto {
  @IsOptional()
  @Length(5)
  language_tag: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  project_ids: string[];

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  translation_ids: string[];
}
