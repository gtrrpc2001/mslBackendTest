import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('ecg_csv_bpmday')
export class BpmdayEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  eq: string;

  @Column({ type: 'varchar' })
  timezone: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'int' })
  bpm: Int32;

  @Column({ type: 'double' })
  temp: Double;

  @Column({ type: 'int' })
  hrv: Int32;

  @Column({ type: 'float' })
  spo2: number;

  @Column({ type: 'tinyint' })
  breathe: number;
}
