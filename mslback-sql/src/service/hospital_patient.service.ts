import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital_patientDto } from 'dto/hospital_patient.dto';
import { Hospital_patientEntity, Hospital_patient_logEntity } from 'entity/hospital_patient.entity';
import {
    Repository,
    MoreThanOrEqual,
    LessThanOrEqual,
    MoreThan,
    LessThan,
} from 'typeorm';

@Injectable()
export class Hospital_patientService {
    constructor(
        @InjectRepository(Hospital_patientEntity)
        private hospital_patientRepository: Repository<Hospital_patientEntity>,
        @InjectRepository(Hospital_patient_logEntity)
        private hospital_patientLogRepository: Repository<Hospital_patient_logEntity>,
    ) { }

    async getHospital_RoomData(): Promise<any> {
        try {
            const result = await this.hospital_patientRepository
                .createQueryBuilder()
                .select('*')
                .getRawMany();
            return result;
        } catch (E) {
            console.log(E);
        }
    }

    async setHospital_RoomData(body: Hospital_patientDto): Promise<any> {
        try {
            const updateResult = await this.dataUpdate(body);
            if (updateResult) {
                return await this.dataLogInsert(body);
            }
            return false;
        } catch (E) {
            console.log(E);
        }
    }

    async dataUpdate(body: Hospital_patientDto) {
        try {
            const result = await this.hospital_patientRepository
                .createQueryBuilder()
                .update(Hospital_patientEntity)
                .set({ eq: body.eq, writetime: body.writetime, room: body.room, bed: body.bed })
                .where({ eq: body.eq })
                .execute();
            return result.affected > 0;
        } catch (E) {
            console.log(E);
        }
    }

    async dataLogInsert(body: Hospital_patientDto) {
        try {
            const result = await this.hospital_patientLogRepository
                .createQueryBuilder()
                .insert()
                .into(Hospital_patient_logEntity)
                .values([
                    {
                        eq: body.eq,
                        writetime: body.writetime,
                        room: body.room,
                        bed: body.bed
                    },
                ])
                .execute();
            return result.identifiers.length > 0;
        } catch (E) {
            console.log(E);
        }
    }
}
