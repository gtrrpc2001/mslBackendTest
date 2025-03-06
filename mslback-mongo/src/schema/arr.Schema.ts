import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Document } from "mongoose";

const options : SchemaOptions = ({
        timestamps: true,           
        collection:"arrEcg"
    })


@Schema(options)
export class Arr extends Document{    

    @Prop()
    @IsString()
    @IsNotEmpty()
    eq: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    writetime:string;

    @Prop()
    @IsString()    
    timezone:string;

    @Prop()   
    @IsNumber()
    bodystate:number;

    @Prop()
    @IsArray()    
    ecgpacket:number[];

    @Prop()
    @IsString()
    @IsNotEmpty()
    address:string;

    // readonly readOnlyData: {eq:string; writetime:string; timezone:string; bpm:number; ecgpacket:number[]}
}

export const ArrSchema = SchemaFactory.createForClass(Arr);