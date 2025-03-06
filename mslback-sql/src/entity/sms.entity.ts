import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('sms')
export class smsEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'int' })
  nationalCode: Int32;
}
