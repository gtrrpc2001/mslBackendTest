import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientOptions, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";
import { join } from "path";

@Injectable()
export class GrpcEcgService implements ClientsModuleOptionsFactory {
    constructor(
        private readonly config: ConfigService
    ) { }
    createClientOptions(): ClientOptions {
        return {
            transport: Transport.GRPC,
            options: {
                package: 'ecg',
                protoPath: join(__dirname, '../public/proto/ecg.proto'),
                url: 'localhost:50051',
            },
        };
    }
}

@Injectable()
export class GrpcArrService implements ClientsModuleOptionsFactory {
    constructor(
        private readonly config: ConfigService
    ) { }
    createClientOptions(): ClientOptions {
        return {
            transport: Transport.GRPC,
            options: {
                package: 'arr',
                protoPath: join(__dirname, '../public/proto/arr.proto'),
                url: 'localhost:50052',
            },
        };
    }
}