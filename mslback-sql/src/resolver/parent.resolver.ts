import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

@Resolver(of => UserDTO)
@ApiTags('parent')
export class ParentResolver {
    constructor(private readonly userService: UserService) { }

    @Mutation(returns => Boolean)
    async DeleteUser(@Args('input') body: UserDTO): Promise<boolean> {
        return await this.userService.DeleteUser(body);
    }

    @Mutation(() => Boolean || UserDTO)
    async MobileSignIn(
        @Args('input') body: UserDTO,
        @Args('role') role: string
    ): Promise<boolean | UserDTO> {
        switch (role) {
            case 'user':
                return await this.userService.MobileUserSignUp(body);
            case 'parent':
            // return await this.userService.MobileParentSignIn(body);
            case 'business':
            // return await this.userService.MobileBusinessSignIn(body);
            default:
                throw new Error('Invalid role');
        }
    }

    @Mutation(() => Boolean || UserDTO)
    async WebSignIn(
        @Args('input') body: UserDTO,
        @Args('role') role: string
    ): Promise<boolean | UserDTO> {
        switch (role) {
            case 'user':
            // return await this.userService.WebUserSignIn(body);
            case 'parent':
            // return await this.userService.WebParentSignIn(body);
            case 'business':
            // return await this.userService.WebBusinessSignIn(body);
            default:
                throw new Error('Invalid role');
        }
    }

    @Mutation(() => Boolean)
    async UpdateProfile(@Args('input') body: UserDTO): Promise<boolean> {
        return await this.userService.UpdateProfile(body);
    }

    @Mutation(() => Boolean)
    async updatePWD(@Args('input') body: UserDTO): Promise<boolean> {
        return await this.userService.updatePWD(body);
    }

    @Mutation(() => Boolean)
    async updateAppKey(@Args('input') body: UserDTO): Promise<boolean> {
        return await this.userService.updateAppKey(body);
    }

    @Mutation(() => Boolean)
    async updateLogin_out(@Args('input') body: UserDTO): Promise<boolean> {
        return await this.userService.updateLogin_out(body.eq, body.differtime);
    }

    @Query(returns => String)
    async getCheckIDDupe(@Args('eq') eq: string): Promise<string> {
        return await this.userService.checkIDDupe(eq);
    }

    @Query(returns => String)
    async getFindID(
        @Args('name') name: string,
        @Args('phone') phone: string,
        @Args('birth') birth: string,
    ): Promise<string> {
        return await this.userService.findID(name, phone, birth);
    }

    @Query(returns => String)
    async getProfile(@Args('eq') eq: string): Promise<string> {
        return await this.userService.getProfile(eq);
    }

    @Query(returns => String)
    async getCheckLogin(
        @Args('eq') eq: string,
        @Args('pw') pw: string,
        @Args('phone') phone: string,
        @Args('token') token: string,
        @Args('destroy') destroy: boolean,
    ): Promise<string> {
        return await this.userService.checkLogin(eq, pw, phone, token);
    }

    @Query(returns => String)
    async checkPhone(@Args('phone') phone: string): Promise<string> {
        return await this.userService.checkPhone(phone);
    }

    @Query(returns => String)
    async getAppKey(@Args('eq') eq: string): Promise<string> {
        return await this.userService.getAppKey(eq);
    }

    @Query(returns => Boolean)
    async getManagerCheck(@Args('eq') eq: string): Promise<boolean> {
        return await this.userService.webManagerCheck(eq);
    }

    @Query(returns => String)
    async test(@Args('eq') eq: string): Promise<string> {
        return await this.userService.testQueue(eq);
    }
}
