import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { EcgDataDTO } from "dto/ecgdata.dto";

@Injectable()
export class SendArrService implements OnModuleInit {
    private sendArrService: any;

    constructor(@Inject('ARR_PACKAGE') private readonly client: ClientGrpc) { }

    onModuleInit() {
        this.sendArrService = this.client.getService('SendArrService');
    }

    sendArrData(data: EcgDataDTO): Promise<{ result: string }> {
        return new Promise((resolve, reject) => {
            this.sendArrService.SendEcgData(data).subscribe({
                next: (response: { result: string }) => {
                    resolve({ result: response.result });
                },
                error: reject,
            });
        });
    }
}