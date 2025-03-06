
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ALLHeaderMiddleware } from "middleware/all.middleware";
import { Admin_login_logModule } from "module/admin_login_log.module";
import { App_bleModule } from "module/app_ble.module";
import { App_logModule } from "module/app_log.module";
import { AppleModule } from "module/apple.module";
import { AppVersionModule } from "module/appversion.module";
import { ecg_byteModule } from "module/ecg_byte.module";
import { BpmdayModule } from "module/bpmday.module";
import { DailyDataModule } from "module/dailydata.module";
import { Ecg_ArrModule } from "module/ecg_arr.module";
import { DataUpdateLastModule } from "module/dataUpdateLast.module";
import { Ecg_stressModule } from "module/ecg_stress.module";
import { ExerciseModule } from "module/exercise.module";
import { GoogleModule } from "module/google.module";
import { Hospital_patientModule } from "module/hospital_patient.module";
import { parentsModule } from "module/parents.module";
import { smsModule } from "module/sms.module";

export const restfulModule = [
    Ecg_ArrModule,
    BpmdayModule,
    DailyDataModule,
    DataUpdateLastModule,
    Admin_login_logModule,
    parentsModule,
    AppVersionModule,
    ecg_byteModule,
    smsModule,
    App_logModule,
    App_bleModule,
    ExerciseModule,
    GoogleModule,
    AppleModule,
    Ecg_stressModule,
    Hospital_patientModule,
]

@Module({
    imports: restfulModule,
    controllers: [],
    providers: [],
})
export class RestModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ALLHeaderMiddleware)
            .forRoutes('msl/*');
    }
}

