import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Arr, ArrSchema } from 'src/schema/arr.Schema';
import { ArrController } from 'src/controller/arr.controller';
import { ArrService } from 'src/service/arr.service';



@Module({
  imports: [
    MongooseModule.forFeature([{name:Arr.name,schema:ArrSchema}]),          
],
  controllers: [ArrController],  
  providers: [ArrService],
})

export class ArrModule{}