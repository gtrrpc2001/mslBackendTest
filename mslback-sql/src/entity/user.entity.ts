import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@ObjectType()
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Field()
  idx: number;

  @Column({ type: 'varchar' })
  @Field()
  gubun: string;

  @Column({ type: 'varchar' })
  @Field()
  businessNum: string;

  @Column({ type: 'varchar' })
  @Field()
  businessName: string;

  @Column({ type: 'varchar' })
  @Field()
  department: string;

  @Column({ type: 'varchar' })
  @Field()
  rank: string;

  @Column({ type: 'varchar' })
  @Field()
  eqname: string;

  @Column({ type: 'varchar' })
  @Field()
  phone: string;

  @Column({ type: 'varchar' })
  @Field()
  number: string;

  @Column({ type: 'varchar' })
  @Field()
  email: string;

  @Column({ type: 'varchar' })
  @Field()
  address: string;

  @Column({ type: 'varchar' })
  @Field()
  eq: string;

  @Column({ type: 'text' })
  @Field()
  password: string;

  @Column({ type: 'text' })
  @Field()
  temporaryPwd: string;

  @Column({ type: 'varchar' })
  @Field()
  sex: string;

  @Column({ type: 'varchar' })
  @Field()
  height: string;

  @Column({ type: 'varchar' })
  @Field()
  weight: string;

  @Column({ type: 'varchar' })
  @Field()
  age: string;

  @Column({ type: 'date' })
  @Field()
  birth: string;

  @Column({ type: 'varchar' })
  @Field()
  work: string;

  @Column({ type: 'varchar' })
  @Field()
  memo: string;

  @Column({ type: 'varchar' })
  @Field()
  authority: string;

  @Column({ type: 'date' })
  @Field()
  sdate: string;

  @Column({ type: 'date' })
  @Field()
  edate: string;

  @Column({ type: 'varchar' })
  @Field()
  approval: string;

  @Column({ type: 'varchar' })
  @Field()
  contractSign: string;

  @Column({ type: 'datetime' })
  @Field()
  workSdate: string;

  @Column({ type: 'datetime' })
  @Field()
  workEdate: string;

  @Column({ type: 'int' })
  @Field()
  tryLogin: number;

  @Column({ type: 'int' })
  @Field()
  lock: number;

  @Column({ type: 'datetime' })
  @Field()
  lockdate: string;

  @Column({ type: 'datetime' })
  @Field()
  signupdate: string;

  @Column({ type: 'int' })
  @Field()
  sleeptime: number;

  @Column({ type: 'int' })
  @Field()
  uptime: number;

  @Column({ type: 'int' })
  @Field()
  bpm: number;

  @Column({ type: 'int' })
  @Field()
  step: number;

  @Column({ type: 'int' })
  @Field()
  distanceKM: number;

  @Column({ type: 'int' })
  @Field()
  calexe: number;

  @Column({ type: 'int' })
  @Field()
  cal: number;

  @Column({ type: 'int' })
  @Field()
  alarm_sms: number;

  @Column({ type: 'int' })
  differtime: number;

  @Column({ type: 'varchar' })
  @Field()
  protecteq: string;

  @Column({ type: 'int' })
  @Field()
  appKey: number;

  @Column({ type: 'tinyint' })
  @Field()
  way: number;

  @Column({ type: 'varchar' })
  @Field()
  refreshtoken: string;

  @Column({ type: 'datetime' })
  @Field()
  refreshdate: string;

  @Column({ type: 'varchar' })
  @Field()
  accesstoken: string;

  @Column({ type: 'datetime' })
  @Field()
  accessdate: string;

  @Column({ type: 'varchar' })
  @Field()
  firebasetoken: string;
}

@Entity('delete_user_log')
export class DeleteUserLogEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  gubun: string;

  @Column({ type: 'varchar' })
  businessNum: string;

  @Column({ type: 'varchar' })
  businessName: string;

  @Column({ type: 'varchar' })
  department: string;

  @Column({ type: 'varchar' })
  rank: string;

  @Column({ type: 'varchar' })
  eqname: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  number: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  eq: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  temporaryPwd: string;

  @Column({ type: 'varchar' })
  sex: string;

  @Column({ type: 'varchar' })
  height: string;

  @Column({ type: 'varchar' })
  weight: string;

  @Column({ type: 'varchar' })
  age: string;

  @Column({ type: 'date' })
  birth: string;

  @Column({ type: 'varchar' })
  work: string;

  @Column({ type: 'varchar' })
  memo: string;

  @Column({ type: 'varchar' })
  authority: string;

  @Column({ type: 'date' })
  sdate: string;

  @Column({ type: 'date' })
  edate: string;

  @Column({ type: 'varchar' })
  approval: string;

  @Column({ type: 'varchar' })
  contractSign: string;

  @Column({ type: 'datetime' })
  workSdate: string;

  @Column({ type: 'datetime' })
  workEdate: string;

  @Column({ type: 'int' })
  tryLogin: number;

  @Column({ type: 'int' })
  lock: number;

  @Column({ type: 'datetime' })
  lockdate: string;

  @Column({ type: 'datetime' })
  signupdate: string;

  @Column({ type: 'int' })
  sleeptime: number;

  @Column({ type: 'int' })
  uptime: number;

  @Column({ type: 'int' })
  bpm: number;

  @Column({ type: 'int' })
  step: number;

  @Column({ type: 'int' })
  distanceKM: number;

  @Column({ type: 'int' })
  calexe: number;

  @Column({ type: 'int' })
  cal: number;

  @Column({ type: 'int' })
  alarm_sms: number;

  @Column({ type: 'int' })
  differtime: number;

  @Column({ type: 'varchar' })
  protecteq: string;

  @Column({ type: 'tinyint' })
  way: number;
}
