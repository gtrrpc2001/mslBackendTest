import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('ecg_csv_ecgdata_arr')
export class Ecg_ArrEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  eq: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'varchar' })
  timezone: string;

  @Column({ type: 'tinyint' })
  bodystate: Int32;

  @Column({ type: 'text' })
  ecgpacket: string;

  @Column({ type: 'varchar' })
  address: string;
}
