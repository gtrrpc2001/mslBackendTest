import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AppVersionDTO {
  @IsString()
  readonly app: string;

  @IsString()
  readonly gubun: string;

  @IsNumber()
  readonly versioncode: number;

  @IsOptional()
  @IsString()
  readonly apkkey: string;
}
