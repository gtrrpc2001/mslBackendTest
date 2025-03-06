import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Hospital_patientService } from '@service/hospital_patient.service';
import { Hospital_patientDto } from 'dto/hospital_patient.dto';


@Controller('msl/hospital')
@ApiTags('hospital')
export class Hospital_patientController {
    constructor(private readonly hospital_patientService: Hospital_patientService) { }

    @Post('/update')
    async create(@Body() body: Hospital_patientDto): Promise<boolean> {
        return await this.hospital_patientService.setHospital_RoomData(body);
    }

    @Get('/select')
    async findList() {
        return await this.hospital_patientService.getHospital_RoomData();
    }
}
