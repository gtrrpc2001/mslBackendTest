import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectModel } from '@nestjs/mongoose';
import  { Model, ObjectId, UpdateWriteOpResult} from 'mongoose';
import { EcgDto } from 'src/dto/ecg.dto';
import { Ecg } from 'src/schema/ecg.Schema';

@Injectable()
export class EcgService {
  constructor(
    @InjectModel(Ecg.name) private ecgModel: Model<Ecg>,    
    // private elasticsearchService:ElasticsearchService
  ){}

  // async search(text: string) {
  //   const response = await this.elasticsearchService.search({
  //     index: 'index',
  //     body: {
  //       query: {
  //         match: { "message": text },
  //       },
  //     },
  //   });
  //   return response.hits.hits;
  // }

  async create(ecg:EcgDto): Promise<Ecg>{
    try{     
      
      return await this.ecgModel.create(ecg)
      // const createdEcg = new this.ecgModel(ecg);          
      // return await createdEcg.save();
    }catch(E){
      console.log(E)
      console.log(E.stack)
    }    
  }

  async findAll():Promise<Ecg[]>{
    // mongoose.model(Ecg.name,EcgSchema,'realtimeEcg')
    return await this.ecgModel.find().exec()
  }

  async findMany(eq:string,startDate:string,endDate:string):Promise<Ecg[]>{
    return await this.ecgModel.find({
      eq:eq,
      writetime:{
      $gte:startDate,
      $lt:endDate
    }})
  }

  async findOne(eq:string):Promise<Ecg>{
    return await this.ecgModel.findOne({eq});
  }

  async findOneAndUpdate(ecg:EcgDto):Promise<Ecg>{    
    const updatedEcg = await this.ecgModel.findOneAndUpdate({eq:ecg.eq},{$set:{writetime:ecg.writetime}},{new:true})
    return updatedEcg
  }

  async updateMany(ecg:EcgDto):Promise<UpdateWriteOpResult>{    
    const updatedEcg = await this.ecgModel.updateMany({eq:ecg.eq},{$set:{writetime:ecg.writetime}},{new:true})
    return updatedEcg
  }

  async delete(ecg:EcgDto):Promise<{deletedCount: number}>{    
    const deletedEcg = await this.ecgModel.deleteMany({eq:ecg.eq}).exec();
    return deletedEcg
  }
}
