import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('appversion')
export class AppVersionEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  app: string;

  @Column({ type: 'varchar' })
  gubun: string;

  @Column({ type: 'int' })
  versioncode: Int32;

  @Column({ type: 'varchar' })
  apkkey: string;
}
