import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExerciseController } from 'src/controller/exercise.controller';
import { ExerciseService } from 'src/service/exercise.service';
import { Exercise, ExerciseSchema } from 'src/schema/exercise.Schema';



@Module({
  imports: [
    MongooseModule.forFeature([{name:Exercise.name,schema:ExerciseSchema}]),          
],
  controllers: [ExerciseController],  
  providers: [ExerciseService],
})

export class ExerciseModule{}