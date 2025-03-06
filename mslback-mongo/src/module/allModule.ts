import { ConfigModule } from "@nestjs/config";
import { MongoConfig } from "src/module/mongoConfig";
import { EcgModule } from "./ecg.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ArrModule } from "./arr.module";
import { ExerciseModule } from "./exercise.module";

export class AllModule{
    static allImport=[
        ConfigModule.forRoot({
            isGlobal:true,
            envFilePath:'.env',
        }),
        MongooseModule.forRootAsync({useClass:MongoConfig,inject:[MongoConfig]}),        
        EcgModule,
        ArrModule,
        ExerciseModule
    ]
}