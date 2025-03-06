import { IsNumber, IsOptional, IsString, isNumber } from 'class-validator';

export class EcgDataDTO {
  @IsString()
  readonly kind: string;

  @IsNumber()
  @IsOptional()
  readonly idx: number;

  @IsString()
  readonly eq: string;

  @IsString()
  @IsOptional()
  readonly timezone: string;

  @IsString()
  @IsOptional()
  readonly writetime: string;

  @IsString()
  @IsOptional()
  readonly ecgtimezone: string;

  @IsString()
  @IsOptional()
  readonly arrStatus: string;

  @IsString()
  @IsOptional()
  readonly ecgPacket: string;

  @IsNumber()
  @IsOptional()
  readonly bpm: number;

  @IsNumber()
  @IsOptional()
  readonly temp: number;

  @IsNumber()
  @IsOptional()
  readonly hrv: number;

  @IsString()
  @IsOptional()
  readonly startDate: string;

  @IsString()
  @IsOptional()
  readonly endDate: string;

  @IsNumber()
  @IsOptional()
  readonly datayear: Number;

  @IsNumber()
  @IsOptional()
  readonly datamonth: number;

  @IsNumber()
  @IsOptional()
  readonly dataday: number;

  @IsNumber()
  @IsOptional()
  readonly datahour: number;

  @IsNumber()
  @IsOptional()
  readonly step: number;

  @IsNumber()
  @IsOptional()
  readonly distanceKM: number;

  @IsNumber()
  @IsOptional()
  readonly cal: number;

  @IsNumber()
  @IsOptional()
  readonly calexe: number;

  @IsNumber()
  @IsOptional()
  readonly arrcnt: number;

  @IsNumber()
  @IsOptional()
  readonly battery: number;

  @IsNumber()
  @IsOptional()
  readonly bodystate: number;

  @IsString()
  @IsOptional()
  readonly address: string;

  @IsNumber()
  @IsOptional()
  readonly isack: number;

  @IsString()
  @IsOptional()
  readonly log: string;

  @IsNumber()
  @IsOptional()
  readonly spo2: number;

  @IsNumber()
  @IsOptional()
  readonly breathe: number;
}
