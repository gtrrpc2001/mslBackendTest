import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from '../dto/user.dto';
import { commonFun } from '../clsfunc/commonfunc';
import { DeleteUserLogEntity, UserEntity } from '../entity/user.entity';
import {
  delete_user_last_logEntity,
  DataUpdateLastEntity,
} from '../entity/dataUpdateLast.entity';
import { parentsEntity } from '../entity/parents.entity';
import { isDefined } from 'class-validator';
import { pwBcrypt } from '../clsfunc/pwAES';
import { ConfigService } from '@nestjs/config';
import { UserCommonQuerycheckIDDupe } from './user.commonQuery';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { LoggerService } from 'factory/logger.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { AuthService } from './jwt/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DataUpdateLastEntity)
    private ecg_raw_history_lastRepository: Repository<DataUpdateLastEntity>,
    @InjectRepository(parentsEntity)
    private parentsRepository: Repository<parentsEntity>,
    @InjectRepository(DeleteUserLogEntity)
    private DeleteUserLogRepository: Repository<DeleteUserLogEntity>,
    @InjectRepository(delete_user_last_logEntity)
    private delete_user_last_logRepository: Repository<delete_user_last_logEntity>,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
    private readonly loggerService: LoggerService,
    @InjectQueue('user-signin') private userSignupQueue: Queue,
    private readonly authService: AuthService
  ) { }

  async testQueue(eq: string) {
    const job = await this.userSignupQueue.add('sign', { eq });
    return job.id;
  }

  async test(eq: string) {
    return eq
  }

  async DeleteUser(body: UserDTO): Promise<boolean> {
    try {
      let bool = await this.setInsert(
        this.DeleteUserLogRepository,
        DeleteUserLogEntity,
        body,
      );
      let lastInsert = await this.setLastLogInsert(body.eq);
      if (bool && lastInsert) {
        return await this.setDelete(body.eq);
      } else {
        return false;
      }
    } catch (error) {
      this.loggerService.Error(error);
      return false;
    }
  }

  async setLastLogInsert(eq: string): Promise<boolean> {
    try {
      const info = await this.getLastInfo(eq);
      if (info) {
        const result = await this.delete_user_last_logRepository
          .createQueryBuilder()
          .insert()
          .into(delete_user_last_logEntity)
          .values([
            {
              ...info
            },
          ])
          .execute();
        this.loggerService.Info(`setLastLogInsert : ${result}`);
        return result.identifiers.length > 0;
      }
      return false;
    } catch (error) {
      this.loggerService.Error(error);
      return false;
    }
  }

  async getLastInfo(eq: string): Promise<DataUpdateLastEntity> {
    try {
      const result: DataUpdateLastEntity =
        await this.ecg_raw_history_lastRepository
          .createQueryBuilder()
          .select('*')
          .where({ eq: eq })
          .getRawOne();
      return result;
    } catch (error) {
      this.loggerService.Error(error);
      return;
    }
  }

  async setDelete(eq: string): Promise<boolean> {
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .delete()
        .where({ eq: eq })
        .execute();
      if (result.affected > 0) {
        const deleteLast = await this.lastDelete(eq);
        return deleteLast;
      }
      return false;
    } catch (error) {
      this.loggerService.Error(error);
      return false;
    }
  }

  async lastDelete(eq: string): Promise<boolean> {
    try {
      const result = await this.ecg_raw_history_lastRepository
        .createQueryBuilder()
        .delete()
        .where({ eq: eq })
        .execute();
      return result.affected > 0;
    } catch (error) {
      this.loggerService.Error(error);
      return false;
    }
  }

  async UpdateProfile(body: UserDTO) {
    let boolResult = false;
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({
          ...body
        })
        .where({ eq: body.eq })
        .execute();
      boolResult = result.affected > 0;
      if (boolResult) boolResult = await this.lastUpdate(body);
      this.loggerService.Info('setProfile');
      return boolResult;
    } catch (error) {
      this.loggerService.Error(error);
      return boolResult;
    }
  }

  async lastUpdate(body: UserDTO): Promise<boolean> {
    try {
      const result = await this.ecg_raw_history_lastRepository
        .createQueryBuilder()
        .update(DataUpdateLastEntity)
        .set({
          eqname: body.eqname,
        })
        .where({ eq: body.eq })
        .execute();
      return result.affected > 0;
    } catch (error) {
      this.loggerService.Error(error);
      return false;
    }
  }

  async IssueToken_UpdateUser(body: UserDTO, role: string): Promise<string | boolean> {
    try {

      const { refreshToken, accessToken, issuedAt } = await this.authService.createToken(body, role)

      const result = await this.userRepository.createQueryBuilder()
        .update(UserEntity)
        .set({ refreshtoken: refreshToken, accesstoken: accessToken, refreshdate: issuedAt, accessdate: issuedAt })
        .where({ eq: body.eq })
        .execute();
      if (result.affected > 0) {
        return accessToken;
      }
      return false;
    } catch (error) {
      this.loggerService.Error('IssueToken_UpdateUser error : ', error)
      return false;
    }
  }

  async MobileUserSignUp(body: UserDTO): Promise<UserDTO | boolean> {
    let boolResult = false;
    try {
      const insertChecked = await this.setInsert(
        this.userRepository,
        UserEntity,
        body,
      );
      if (insertChecked) {
        const getToken = await this.IssueToken_UpdateUser(body, 'm');
        if (!getToken) {
          this.loggerService.Error('Token issuance failed, deleting user...');
          await this.userRepository.delete({ eq: body.eq });
          return boolResult;
        }

        const result = await this.ecg_raw_history_lastRepository
          .createQueryBuilder()
          .insert()
          .into(DataUpdateLastEntity)
          .values([
            {
              eq: body.eq,
              eqname: body.eqname,
            },
          ])
          .execute();
        this.loggerService.Info(`${body.eq}--${body.eqname}`);
        boolResult = result.identifiers.length > 0;
      }

      if (boolResult) {
        return insertChecked;
      }
      return boolResult;
    } catch (error) {
      this.loggerService.Error(error);
      return boolResult;
    }
  }

  async setInsert(
    repository: any,
    entity: any,
    body: UserDTO,
  ): Promise<UserDTO | undefined> {
    try {
      const AESpwd = await pwBcrypt.transformPassword(body.password);
      const result = await repository
        .createQueryBuilder()
        .insert()
        .into(entity)
        .values([
          {
            ...body, password: AESpwd
          },
        ])
        .execute();
      this.loggerService.Info('delete 저장부분');

      if (result.identifiers.length > 0) {
        return body;
      } else {
        return undefined;
      }
    } catch (error) {
      this.loggerService.Error(error);
      return undefined;
    }
  }

  async getProfile(empid: string): Promise<string> {

    //프로필정보 -- 보호자 번호까지 받아옴
    return await UserCommonQuerycheckIDDupe.getProfile(
      this.userRepository,
      parentsEntity,
      empid,
    );
  }

  async CheckLoginGuardianApp(
    empid: string,
    pw: string,
    phone: string,
    token: string,
  ): Promise<any> {
    // 보호자앱 phone 번호까지 로그인 할떄 체크 후 token update
    let boolResult: any = false;
    if (isDefined(empid) && isDefined(pw) && isDefined(phone)) {
      boolResult = await this.guardianLoginCheck(empid, pw, phone);

      if (boolResult && isDefined(token)) {
        const parentsResult = await this.tokenUpdateGuardianApp(
          empid,
          phone,
          token,
        );
        return parentsResult;
      }
    }
    return boolResult;
  }

  async tokenUpdateGuardianApp(
    empid: string,
    phone: string,
    token: string,
  ): Promise<boolean> {
    try {
      const result = await this.parentsRepository
        .createQueryBuilder()
        .update(parentsEntity)
        .set({ token: token, writetime: commonFun.getWritetime() })
        .where({ eq: empid })
        .andWhere({ phone: phone })
        .execute();
      return result.affected > 0;
    } catch (error) {
      this.loggerService.Error(error);
      return false;
    }
  }

  async guardianLoginCheck(
    empid: string,
    pw: string,
    phone: string,
  ): Promise<boolean> {
    try {
      let select = 'b.eq,b.phone,a.password';
      let condition = `a.eq = b.eq and b.phone = ${phone}`;
      const result = await this.userRepository
        .createQueryBuilder('a')
        .select(select)
        .innerJoin(parentsEntity, 'b', condition)
        .where({ eq: empid })
        .getRawOne();
      const password = result.password;
      return await pwBcrypt.validatePwd(pw, password);
    } catch (error) {
      this.loggerService.Error(error);
      return false;
    }
  }

  async checkLogin(
    empid: string,
    pw: string,
    phone: string,
    token: string,
  ): Promise<string> {
    let boolResult = false;
    if (isDefined(phone)) {
      boolResult = await this.CheckLoginGuardianApp(empid, pw, phone, token);
    } else {
      boolResult = await this.checkPassword(empid, pw);
    }
    if (boolResult && !isDefined(phone))
      boolResult = await this.updateLogin_out(empid, 1);

    this.loggerService.Info(`${empid}------${pw}`);
    return `result = ${boolResult}`;
  }

  async checkPassword(empid: string, pw: string): Promise<any> {
    try {
      const result: UserEntity = await this.userRepository
        .createQueryBuilder('user')
        .select('password')
        .where({ eq: empid })
        .getRawOne();
      const password = result?.password;
      return password && pw ? await pwBcrypt.validatePwd(pw, password) : false
    } catch (error) {
      this.loggerService.Error(error);
      return false;
    }
  }

  async updateLogin_out(empid: string, loginNumber: number): Promise<boolean> {
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({ differtime: loginNumber })
        .where({ eq: empid })
        .execute();
      return result.affected > 0;
    } catch (error) {
      this.loggerService.Error(error);
      return false;
    }
  }

  async checkIDDupe(empid: string): Promise<string> {
    // 회원가입 하기전에  web user에 동일한 eq 값 체크 해주기 체크해서 존재하면 값 가져와서 회원가입
    return UserCommonQuerycheckIDDupe.checkIDDupe(this.userRepository, empid)
  }

  async findID(name: string, phone: string, birth: string): Promise<string> {
    let boolResult = false;
    this.loggerService.Info('checkIDDupe');
    const result: UserEntity[] = await this.userRepository
      .createQueryBuilder('user')
      .select('eq')
      .where({ eqname: name })
      .andWhere({ phone: phone })
      .andWhere({ birth: birth })
      .getRawMany();

    if (result.length != 0 && name != '' && phone != '' && birth != '') {
      return commonFun.converterJson(result);
    } else {
      return `result = ${boolResult}`;
    }
  }

  async updatePWD(body: UserDTO) {
    let boolResult = false;
    try {
      const AESpwd = await pwBcrypt.transformPassword(body.password);
      const result = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({ password: AESpwd })
        .where({ eq: body.eq })
        .execute();
      boolResult = result.affected > 0;
      this.loggerService.Info('updatePWD');
      return boolResult;
    } catch (error) {
      this.loggerService.Error(error);
      return boolResult;
    }
  }

  async checkPhone(phone: string): Promise<string> {
    try {
      let bool = false;
      const result = await this.userRepository
        .createQueryBuilder()
        .select('phone')
        .where({ phone: phone })
        .getRawMany();
      if (result.length == 0) bool = true;

      this.loggerService.Info('checkPhone');
      return `result = ${bool}`;
    } catch (error) {
      this.loggerService.Error(error);
    }
  }

  async getAppKey(empid: string): Promise<string> {
    try {
      const result: UserEntity = await this.userRepository
        .createQueryBuilder('user')
        .select('appKey')
        .where({ eq: empid })
        .getRawOne();
      this.loggerService.Info('getAppKey ', empid);
      return commonFun.converterJson(result?.appKey);
    } catch (error) {
      this.loggerService.Error(error);
    }
  }

  async updateAppKey(body: UserDTO): Promise<any> {
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({ appKey: body.appKey })
        .where({ eq: body.eq })
        .execute();
      return result.affected > 0;
    } catch (error) {
      this.loggerService.Error(error);
      return false;
    }
  }

  webManagerCheck = async (eq: string): Promise<boolean> => {
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .select('eqname')
        .where({ eq: eq })
        .getRawOne();
      if (result.eqname == this.configService.get<string>('MANAGER'))
        return true;
      else return false;
    } catch (error) {
      this.loggerService.Error(error);
      return false;
    }
  };
}
