import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCommonQuerycheckIDDupe } from '@service/user.commonQuery';
import { parentsEntity } from 'entity/parents.entity';

@Injectable()
export class GoogleService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async validateUser(user: any): Promise<any> {
    // 여기서 사용자 정보를 데이터베이스에 저장하거나, 추가 검증을 수행할 수 있습니다.
    // 예를 들어, 사용자가 데이터베이스에 없는 경우, 새로운 사용자로 등록할 수 있습니다.
    console.log('google : ', user);
    return user;
  }

  async validateAndSaveUser(info: any): Promise<any> {
    const { email, refreshToken } = info;
    const checkUser = await UserCommonQuerycheckIDDupe.checkIDDupe(
      this.userRepository,
      email,
    );

    if (checkUser.includes('true')) {
      // const newUser = await this.userService.createSocialUser(socialLoginInfoDto);
      // const updateUser = await this.userService.updateSocialUserInfo(newUser.id);
      // return updateUser;
      return email;
    } else {
      // if (existingUser.socialProvider !== Provider.GOOGLE) {
      //     return {
      //       existingUser: existingUser,
      //       msg: '해당 이메일을 사용중인 계정이 존재합니다.'
      //     }
      //   } else {
      //     const updateUserWithRefToken: User = await this.userService.updateSocialUserRefToken(existingUser.id, refreshToken);
      //     return updateUserWithRefToken;
      // }
    }
  }

  async findUserById(id: string): Promise<string> {
    const user = await UserCommonQuerycheckIDDupe.getProfile(
      this.userRepository,
      parentsEntity,
      id,
    );
    return user;
  }
}
