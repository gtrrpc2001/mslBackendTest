import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('admin_login_log')
export class Admin_login_logEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  gubun: string;

  @Column({ type: 'varchar' })
  eq: string;

  @Column({ type: 'varchar' })
  eqname: string;

  @Column({ type: 'date' })
  writetime: string;

  @Column({ type: 'varchar' })
  activity: string;
}
