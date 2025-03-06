import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, UpdateWriteOpResult } from 'mongoose';
import { ExerciseDto } from 'src/dto/exercise.dto';
import { Exercise } from 'src/schema/exercise.Schema';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
    private config: ConfigService,
  ) {}

  use = Number(this.config.get<number>('USE'));
  unuse = Number(this.config.get<number>('UNUSE'));

  async create(body: ExerciseDto): Promise<boolean> {
    try {
      const result = await this.exerciseModel.create(body);
      return result !== null;
    } catch (E) {
      console.log(E);
      console.log(E.stack);
      return false;
    }
  }

  async findList(eq: string, startDate: string, endDate: string) {
    try {
      const result = await this.exerciseModel.find(
        {
          eq: eq,
          sDate: {
            $gte: startDate,
            $lt: endDate,
          },
          eDate: {
            $gte: startDate,
            $lt: endDate,
          },
          pause: this.use,
        },
        {
          sDate: 1,
          eDate: 1,
          kind: 1,
          cal: 1,
          calexe: 1,
          step: 1,
          distance: 1,
          arrCount: 1,
        },
      );      
      return result;
    } catch (E) {
      console.log(E);
      return [];
    }
  }

  async findData(
    eq: string,
    startDate: string,
    endDate: string,
    kind: string,
  ): Promise<number[]> {
    try {
      const result = await this.exerciseModel.findOne(
        {
          eq: eq,
          kind: kind,
          sDate: startDate,
          eDate: endDate,
        },
        { bpm: 1 },
      );
      return result.bpm;
    } catch (E) {
      console.log(E);
      return [];
    }
  }

  async deleteExercise(body: ExerciseDto): Promise<boolean> {
    const result = await this.exerciseModel.findOneAndUpdate(
      { eq: body.eq, kind: body.kind, sDate: body.sDate, eDate: body.eDate },
      { $set: { pause: this.unuse } },
      { new: true },
    );
    return result !== null;
  }

  async updateTestExercise(body: ExerciseDto): Promise<boolean> {
    const result = await this.exerciseModel.updateMany(
      { pause: { $ne: this.unuse }, eq: body.eq },
      { $set: { pause: this.use } },
      { new: true },
    );
    return result !== null;
  }
}
