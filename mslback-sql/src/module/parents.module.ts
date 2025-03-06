import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { parentsController } from '../controller/parents.controller';
import { parentsEntity } from '../entity/parents.entity';
import { parentsService } from '../service/parents.service';

@Module({
  imports: [TypeOrmModule.forFeature([parentsEntity])],
  controllers: [parentsController],
  providers: [parentsService],
})
export class parentsModule {}
