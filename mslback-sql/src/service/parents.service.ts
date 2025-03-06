import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { commonFun } from '../clsfunc/commonfunc';
import { parentsEntity } from '../entity/parents.entity';
import { parentsDTO } from '../dto/parents.dto';

@Injectable()
export class parentsService {
  constructor(
    @InjectRepository(parentsEntity)
    private parentsRepository: Repository<parentsEntity>,
  ) {}

  async postParent(body: parentsDTO) {
    let boolResult = false;
    try {
      const checkInsert = await this.selPhone(body);
      const length = checkInsert.length;
      if (length != 0) {
        boolResult = await this.parentUpdate(body, length);
      } else {
        boolResult = await this.setInsert(body);
      }
      console.log(`parents -- ${body.eq}`);      
      return `result = ${boolResult}`;
    } catch (E) {
      console.log(E);
      return E as string;
    }
  }

  async setInsert(body: parentsDTO): Promise<boolean> {
    try {
      let index = 0;
      let result;
      for (let phone of body.phones) {
        index += 1;
        result = await this.parentInsert(body, phone, index);
        if(!result)
          break;
      }
      return result;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async parentUpdate(body: parentsDTO, length: number): Promise<boolean> {
    try {
      let index = 0;
      let result;
      for (let phone of body.phones) {
        index += 1;
        console.log(phone);
        if (length < index) {
          result = await this.parentInsert(body, phone, index);
        } else {
          const updateResult = await this.parentsRepository
            .createQueryBuilder()
            .update(parentsEntity)
            .set({ phone: phone })
            .where({ eq: body.eq })
            .andWhere({ phoneindex: index })
            .execute();
          result = updateResult.affected > 0;
        }
      }
      return result;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async selPhone(body: parentsDTO): Promise<parentsEntity[]> {
    try {
      const result = await this.parentsRepository
        .createQueryBuilder('parents')
        .select('phone,phoneindex')
        .where({ eq: body.eq })
        .getRawMany();
      return result;
    } catch (E) {
      console.log(E);
    }
  }

  async parentInsert(
    body: parentsDTO,
    phone: string,
    index: number,
  ): Promise<boolean> {
    try {
      const result = await this.parentsRepository
        .createQueryBuilder()
        .insert()
        .into(parentsEntity)
        .values([
          {
            eq: body.eq,
            timezone: body.timezone,
            writetime: body.writetime,
            phone: phone,
            token: body.token,
            phoneindex: index,
          },
        ])
        .execute();
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async getTime(eq: string): Promise<any> {
    const e = '';
    return e;
  }
}
