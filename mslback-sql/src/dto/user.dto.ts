import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';


@InputType()
export class UserDTO {

  @Field() // 필수 필드
  @IsString()
  readonly eq: string;

  @Field({ nullable: true }) // nullable 속성 추가
  @IsOptional()
  @IsString()
  @Length(8, 20)
  readonly password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  readonly eqname?: string;

  @Field({ nullable: true })
  @IsOptional()
  readonly email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber(null)
  readonly phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly signupdate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly sex?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly height?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly weight?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly age?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly birth?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly sleeptime?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly uptime?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly bpm?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly step?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly distanceKM?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly calexe?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly cal?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly alarm_sms?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly differtime?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly appKey?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly way?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly accessToken?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly accessDate?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly firebaseToken?: string;
}