import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Double, Int32 } from 'typeorm';

export class DataUpdateLastDTO {
  @IsString()
  readonly kind: string;

  @IsString()
  readonly eq: string;

  @IsString()
  @IsOptional()
  readonly log: string;
}
