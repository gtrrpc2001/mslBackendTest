import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import  { Model, ObjectId, UpdateWriteOpResult} from 'mongoose';
import { ArrDto } from 'src/dto/arr.dto';
import { Arr } from 'src/schema/arr.Schema';

@Injectable()
export class ArrService {
  constructor(
    @InjectModel(Arr.name) private arrModel: Model<Arr>,    
  ){}


  async create(body:ArrDto): Promise<Arr>{
    try{     
      
      return await this.arrModel.create(body)
      // const createdEcg = new this.ecgModel(ecg);          
      // return await createdEcg.save();
    }catch(E){
      console.log(E)
      console.log(E.stack)
    }    
  }

  async findAll():Promise<Arr[]>{
    // mongoose.model(Ecg.name,EcgSchema,'realtimeEcg')
    return await this.arrModel.find().exec()
  }

  async findMany(eq:string,startDate:string,endDate:string):Promise<Arr[]>{
    return await this.arrModel.find({
      eq:eq,
      writetime:{
      $gte:startDate,
      $lt:endDate
    }})
  }

  async findOne(eq:string):Promise<Arr>{
    return await this.arrModel.findOne({eq});
  }

  async findOneAndUpdate(body:ArrDto):Promise<Arr>{    
    const updatedArr = await this.arrModel.findOneAndUpdate({eq:body.eq},{$set:{writetime:body.writetime}},{new:true})
    return updatedArr
  }

  async updateMany(body:ArrDto):Promise<UpdateWriteOpResult>{    
    const updatedArr = await this.arrModel.updateMany({eq:body.eq},{$set:{writetime:body.writetime}},{new:true})
    return updatedArr
  }

  async delete(body:ArrDto):Promise<{deletedCount: number}>{    
    const deletedArr = await this.arrModel.deleteMany({eq:body.eq}).exec();
    return deletedArr
  }
}
