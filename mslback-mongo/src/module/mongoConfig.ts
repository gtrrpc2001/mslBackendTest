import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions,MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongoConfig implements MongooseOptionsFactory{
  constructor(private config:ConfigService){}

  createMongooseOptions(): MongooseModuleOptions {
    const mongo :MongooseModuleOptions = {
      uri:this.config.get<string>('MONGODB_URL'), 
      dbName:this.config.get<string>('MONGO_TEST'), 
      
    }
    return mongo
  }    
}