import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('app_ble')
export class App_bleEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  eq: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'varchar' })
  activity: string;

  @Column({ type: 'varchar' })
  serial: string;
}
