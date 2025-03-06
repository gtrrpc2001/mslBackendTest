import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExerciseController } from 'controller/exercise.controller';
import { ExerciseService } from '@service/exercise.service';
import { Exercise, ExerciseSchema } from 'schema/exercise.schema';



@Module({
  imports: [
    MongooseModule.forFeature([{name:Exercise.name,schema:ExerciseSchema}]),          
],
  controllers: [ExerciseController],  
  providers: [ExerciseService],
})

export class ExerciseModule{}