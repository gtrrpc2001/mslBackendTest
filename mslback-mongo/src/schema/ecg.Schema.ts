import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Document } from "mongoose";

const options : SchemaOptions = ({
        timestamps: true,           
        collection:"realtimeEcg"
    })


@Schema(options)
export class Ecg extends Document{    

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
    bpm:number;

    @Prop()
    @IsArray()    
    ecgpacket:number[];

    // readonly readOnlyData: {eq:string; writetime:string; timezone:string; bpm:number; ecgpacket:number[]}
}

export const EcgSchema = SchemaFactory.createForClass(Ecg);
/* virtual field 설정 */
// EcgSchema.virtual('readOnlyData').get(function (this:Ecg){
//     return {
//         eq:this.eq,
//         writetime:this.writetime,
//         timezone : this.timezone,
//         bpm: this.bpm,
//         ecgpacket: this.ecgpacket
//     }
// })