import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExerciseDto{
    
    @IsString()
    eq: string;
    
    @IsString()    
    @IsOptional()
    sDate:string;
    
    @IsString()    
    @IsOptional()
    eDate:string;

    @IsString()    
    @IsOptional()
    kind:string;

    @IsNumber()
    @IsOptional()
    cal:number;

    @IsNumber()    
    @IsOptional()
    calexe:number;

    @IsNumber()    
    @IsOptional()
    step:number;

    @IsNumber()    
    @IsOptional()
    distance:number;

    @IsNumber()    
    @IsOptional()
    arrCount:number;
    
    @IsArray()   
    @IsOptional() 
    bpm:number[];

    @IsNumber()    
    @IsOptional()
    pause:number;    

    
}