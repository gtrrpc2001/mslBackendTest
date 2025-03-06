import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Ecg_byteDTO } from "dto/ecg_byte.dto";

@Injectable()
export class SendEcgService implements OnModuleInit {
    private sendEcgService: any;

    constructor(@Inject('ECG_PACKAGE') private readonly client: ClientGrpc) { }

    onModuleInit() {
        this.sendEcgService = this.client.getService('SendEcgService');
    }

    sendEcgData(data: Ecg_byteDTO): Promise<{ result: string }> {
        return new Promise((resolve, reject) => {
            this.sendEcgService.SendEcgData(data).subscribe({
                next: (response: { result: string }) => {
                    resolve({ result: response.result });
                },
                error: reject,
            });
        });
    }
}

