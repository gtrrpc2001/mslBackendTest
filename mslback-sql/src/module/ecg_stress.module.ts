import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ecg_stressController } from "../controller/ecg_stress.controller";
import { Ecg_stressEntity } from "../entity/ecg_stress.entity";
import { Ecg_stressService } from "../service/ecg_stress.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Ecg_stressEntity])
    ],
    controllers: [Ecg_stressController],
    providers: [Ecg_stressService]
})
export class Ecg_stressModule { }