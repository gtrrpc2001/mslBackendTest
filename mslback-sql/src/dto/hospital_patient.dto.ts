import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Double, Int32 } from 'typeorm';

export class Hospital_patientDto {
    @IsString()
    readonly kind: string;

    @IsString()
    readonly eq: string;

    @IsString()
    @IsOptional()
    readonly writetime: string;

    @IsNumber()
    @IsOptional()
    readonly room: number;

    @IsNumber()
    readonly bed: number;
}
