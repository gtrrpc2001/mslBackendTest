import { Module } from '@nestjs/common';
import { EcgController } from 'src/controller/ecg.controller';
import { EcgService } from 'src/service/ecg.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticSearchConfig } from './ElasticSearchConfig';
import { MongooseModule } from '@nestjs/mongoose';
import { Ecg, EcgSchema } from 'src/schema/ecg.Schema';



@Module({
  imports: [
    // ElasticsearchModule.registerAsync({useClass:ElasticSearchConfig,inject:[ElasticSearchConfig]}),
    MongooseModule.forFeature([{name:Ecg.name,schema:EcgSchema}]),          
],
  controllers: [EcgController],  
  providers: [EcgService],
})

export class EcgModule{}