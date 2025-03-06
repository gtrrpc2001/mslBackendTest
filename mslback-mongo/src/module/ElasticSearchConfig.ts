import { ClientOptions } from "@elastic/elasticsearch";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ElasticsearchOptionsFactory } from "@nestjs/elasticsearch";

@Injectable()
export class ElasticSearchConfig implements ElasticsearchOptionsFactory{
    constructor(private config:ConfigService){}
    createElasticsearchOptions(): ClientOptions | Promise<ClientOptions> {
        const config:ClientOptions = {        
            node:this.config.get<string>('NODEURL'),
            auth:{
                username:this.config.get<string>('ELASTICUSER'),
                password:this.config.get<string>('ELASTICPASSWORD')
            },
            
        }
        return config
    }
}