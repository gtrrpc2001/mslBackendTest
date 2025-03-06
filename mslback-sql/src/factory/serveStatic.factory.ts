import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ServeStaticModuleOptions,
  ServeStaticModuleOptionsFactory,
} from '@nestjs/serve-static';
import { join } from 'path';

@Injectable()
export class ServeStaticFactory implements ServeStaticModuleOptionsFactory {
  constructor(private config: ConfigService) {}
  createLoggerOptions(): ServeStaticModuleOptions[] {
    const p = this.config.get<string>('SERVESTATIC');
    const google = this.config.get<string>('GOOGLEPATH');
    const email = this.config.get<string>('EMAILPATH');
    const googleAsset = this.config.get<string>('GOOGLEFOLDER');
    const emailAsset = this.config.get<string>('EMAILFOLDER');
    
    return [
      {
        rootPath: join(__dirname, '..', p,googleAsset),
        serveRoot: google,
      },
      {
        rootPath: join(__dirname, '..', p,emailAsset),
        serveRoot: email,
      },
    ];
  }
}
