import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class EcgDto{
    
    @IsString()
    eq: string;
    
    @IsString()    
    @IsOptional()
    writetime:string;
    
    @IsString()    
    @IsOptional()
    timezone:string;

    @IsNumber()
    @IsOptional()
    bpm:number;

    
    @IsArray()   
    @IsOptional() 
    ecgpacket:number[];
}