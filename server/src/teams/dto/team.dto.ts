import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateTeamDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  @IsArray()
  @IsNumber({}, { each: true })
  project_ids: number[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  @IsArray()
  @IsNumber({}, { each: true })
  user_ids: number[];
}

export class PatchTeamDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  @IsArray()
  @IsNumber({}, { each: true })
  project_ids: number[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  @IsArray()
  @IsNumber({}, { each: true })
  user_ids: number[];
}
