import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrometheusOptions, PrometheusOptionsFactory } from "@willsoto/nestjs-prometheus";

@Injectable()
export class PrometheusService implements PrometheusOptionsFactory {
    constructor(private configService: ConfigService) { }

   async createPrometheusOptions(): Promise<PrometheusOptions> {
        const result:PrometheusOptions = {
            path:this.configService.get<string>('PROMETHEUS_PATH'),
            defaultMetrics: {
                enabled: true,
                config: {
                    prefix: 'nestjs_',
                },
            }
        }
      return result
    }
}