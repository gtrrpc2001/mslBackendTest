import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('ecg_csv_dataday')
export class DailyDataEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  eq: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'int' })
  datayear: Int32;

  @Column({ type: 'int' })
  datamonth: Int32;

  @Column({ type: 'int' })
  dataday: Int32;

  @Column({ type: 'int' })
  datahour: Int32;

  @Column({ type: 'varchar' })
  timezone: string;

  @Column({ type: 'int' })
  step: Int32;

  @Column({ type: 'double' })
  distanceKM: Double;

  @Column({ type: 'int' })
  cal: Int32;

  @Column({ type: 'int' })
  calexe: Int32;

  @Column({ type: 'int' })
  arrcnt: Int32;
}
