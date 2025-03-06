import { Module, NestModule } from '@nestjs/common';
import { AllModule } from './allModule';
import mongoose from 'mongoose';

@Module({
  imports: AllModule.allImport,
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.NODE_ENV === 'dev' ? true : false;
  configure(){
    mongoose.set('debug', this.isDev)
  }
}
