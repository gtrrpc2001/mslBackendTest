import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Admin_login_logDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'post 구분 값' })
  readonly kind: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly gubun: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly serial: string;

  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly eq: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly eqname: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly timezone: string;

  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly writetime: string;

  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly activity: string;
}
