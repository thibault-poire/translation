import { IsArray, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  team_ids: string[];
}

export class PatchUserDto {
  @IsOptional()
  @IsNotEmpty()
  first_name: string;

  @IsOptional()
  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  team_ids: string[];
}
