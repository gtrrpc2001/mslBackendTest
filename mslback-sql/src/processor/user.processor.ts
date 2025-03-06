import { Processor, WorkerHost } from "@nestjs/bullmq";
import { UserService } from "@service/user.service";
import { Job } from "bullmq";


@Processor('user-signin')
export class UserProcessor extends WorkerHost {
    constructor(private readonly userService: UserService) {
        super();
    }

    async process(job: Job) {
        switch (job.name) {
            case 'sign':
                const { body } = job.data;
                return this.userService.test(body);
            default:
                return;
        }
    }
}