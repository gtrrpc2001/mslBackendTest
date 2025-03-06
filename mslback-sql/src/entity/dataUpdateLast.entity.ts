import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('ecg_raw_history_last')
export class DataUpdateLastEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  eq: string;

  @Column({ type: 'varchar' })
  eqname: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'varchar' })
  timezone: string;

  @Column({ type: 'int' })
  bpm: Double;

  @Column({ type: 'int' })
  hrv: Double;

  @Column({ type: 'int' })
  cal: Double;

  @Column({ type: 'int' })
  calexe: Double;

  @Column({ type: 'int' })
  step: Double;

  @Column({ type: 'int' })
  distanceKM: Double;

  @Column({ type: 'int' })
  arrcnt: Double;

  @Column({ type: 'int' })
  temp: Double;

  @Column({ type: 'int' })
  battery: Int32;

  @Column({ type: 'int' })
  bodystate: Int32;

  @Column({ type: 'int' })
  isack: Int32;

  @Column({ type: 'varchar' })
  log: string;
}

@Entity('delete_user_last_log')
export class delete_user_last_logEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  eq: string;

  @Column({ type: 'varchar' })
  eqname: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'varchar' })
  timezone: string;

  @Column({ type: 'int' })
  bpm: Double;

  @Column({ type: 'int' })
  hrv: Double;

  @Column({ type: 'int' })
  cal: Double;

  @Column({ type: 'int' })
  calexe: Double;

  @Column({ type: 'int' })
  step: Double;

  @Column({ type: 'int' })
  distanceKM: Double;

  @Column({ type: 'int' })
  arrcnt: Double;

  @Column({ type: 'int' })
  temp: Double;

  @Column({ type: 'int' })
  battery: Int32;

  @Column({ type: 'int' })
  bodystate: Int32;

  @Column({ type: 'int' })
  isack: Int32;

  @Column({ type: 'varchar' })
  log: string;
}
