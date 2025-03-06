import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('parents')
export class parentsEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  eq: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'varchar' })
  timezone: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'int' })
  phoneindex: Int32;

  @Column({ type: 'varchar' })
  token: string;
}
