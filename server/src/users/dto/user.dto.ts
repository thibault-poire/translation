import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  @IsArray()
  @IsNumber({}, { each: true })
  team_ids: number[];
}

export class PatchUserDto {
  @IsOptional()
  first_name: string;

  @IsOptional()
  last_name: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  @IsArray()
  @IsNumber({}, { each: true })
  team_ids: number[];
}
