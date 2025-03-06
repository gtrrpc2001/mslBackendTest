import { isDefined } from 'class-validator';
import { UserEntity } from 'entity/user.entity';
import { Repository } from 'typeorm';

export class UserCommonQuerycheckIDDupe {
  static async checkIDDupe(
    userRepository: Repository<UserEntity>,
    empid: string,
  ): Promise<string> {
    let boolResult = false;
    console.log('checkIDDupe');
    if (isDefined(empid)) {
      const result: UserEntity[] = await userRepository
        .createQueryBuilder('user')
        .select('eq')
        .where({ eq: empid })
        .getRawMany();
      //삭제된 아이디 체크시 복원
      // if (result.length == 0) {
      // const rs = await this.DeleteUserLogRepository.createQueryBuilder()
      //   .select('eq')
      //   .where({ eq: empid })
      //   .getRawMany();
      // if (rs.length == 0) boolResult = true;
      // }
      boolResult = result.length == 0;
    }
    return `result = ${boolResult}`;
  }

  static async getProfile(
    Repository: any,
    parentsEntity: any,
    empid: string,
    bool = false,
  ): Promise<string> {
    try {
      let select =
        'a.eq,a.eqname,a.email,a.phone as userphone,a.sex,a.height,a.weight,a.age,a.birth,a.signupdate,' +
        'a.sleeptime,a.uptime,a.bpm,a.step,a.distanceKM,a.calexe,' +
        'a.cal,a.alarm_sms,a.differtime,b.phone';
      let result;
      if (bool) {
        result = await Repository.createQueryBuilder('a')
          .select(select)
          .leftJoin(parentsEntity, 'b', 'a.eq = b.eq')
          .where({ eq: empid })
          .getRawOne();
      } else {
        select += ",a.way"
        result = await Repository.createQueryBuilder('a')
          .select(select)
          .leftJoin(parentsEntity, 'b', 'a.eq = b.eq')
          .where({ eq: empid })
          .getRawMany();
      }

      console.log(result);

      if ((Array.isArray(result) && result.length > 0) || (result && typeof result === 'object')) {
        return JSON.stringify(result);
      }
      return `result = ${false}`;
    } catch (E) {
      console.log(E);
    }
  }
}
