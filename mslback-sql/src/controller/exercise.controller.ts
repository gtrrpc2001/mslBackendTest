import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExerciseService } from '@service/exercise.service';
import { ExerciseDto } from 'dto/exercise.dto';


@Controller('msl/exercise')
@ApiTags('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) { }

  @Post('/create')
  async create(@Body() body: ExerciseDto): Promise<boolean> {
    return await this.exerciseService.create(body);
  }

  @Post('/delete')
  async delete(@Body() body: ExerciseDto): Promise<boolean> {
    return await this.exerciseService.deleteExercise(body);
  }

  @Post('/updateTestData')
  async updateTestData(@Body() body: ExerciseDto): Promise<boolean> {
    return await this.exerciseService.updateTestExercise(body);
  }

  @Get('/list')
  async findList(
    @Query('id') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.exerciseService.findList(eq, startDate, endDate);
  }

  @Get('/data')
  async findData(
    @Query('id') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('kind') kind: string,
  ): Promise<number[]> {
    return await this.exerciseService.findData(eq, startDate, endDate, kind);
  }
}
