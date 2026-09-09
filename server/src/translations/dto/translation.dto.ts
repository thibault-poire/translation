import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateTranslationDto {
  @IsNotEmpty()
  value: string;

  @IsUUID()
  language_id: string;

  @IsOptional()
  @IsUUID()
  key_id: string;
}

export class PatchTranslationDto {
  @IsOptional()
  @IsNotEmpty()
  value: string;

  @IsOptional()
  @IsUUID()
  language_id: string;

  @IsOptional()
  @IsUUID()
  key_id: string;
}
