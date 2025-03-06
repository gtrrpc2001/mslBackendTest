import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Document } from "mongoose";

const options : SchemaOptions = ({
        timestamps: true,           
        collection:"exercise"
    })


@Schema(options)
export class Exercise extends Document{   
    
    @Prop({
        unique:false
    })
    @IsString()
    @IsNotEmpty()
    eq: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    sDate:string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    eDate:string;

    @Prop()
    @IsString()
    kind:string;

    @Prop()
    @IsNumber()    
    cal:number;

    @Prop()   
    @IsNumber()
    calexe:number;

    @Prop()
    @IsNumber()    
    step:number;

    @Prop()
    @IsNumber()
    distance:number;

    @Prop()
    @IsNumber()
    arrCount:number;

    @Prop()
    @IsArray()
    bpm:number[];

    @Prop()
    @IsNumber()
    pause:number;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);