import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class ArrDto{
    
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
    bodystate:number;

    
    @IsArray()   
    @IsOptional() 
    ecgpacket:number[];

    @IsString()    
    @IsOptional()
    address:string;
}