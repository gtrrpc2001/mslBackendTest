import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('ecg_byte')
export class Ecg_byteEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  eq: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'varchar' })
  timezone: string;

  @Column({ type: 'int' })
  bpm: Int32;

  @Column({ type: 'blob' })
  ecgpacket: Buffer;
}
