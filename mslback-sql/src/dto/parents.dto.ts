import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Double, Int32 } from 'typeorm';

export class parentsDTO {
  @IsString()
  readonly eq: string;

  @IsString()
  readonly writetime: string;

  @IsString()
  @IsOptional()
  readonly timezone: string;

  @IsArray()
  @IsOptional()
  readonly phones?: string[];

  @IsOptional()
  @IsString()
  readonly phone: string;

  @IsString()
  @IsOptional()
  readonly token: string;
}
