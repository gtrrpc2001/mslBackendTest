import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('hospital_patient')
export class Hospital_patientEntity {

    @PrimaryGeneratedColumn()
    idx: number;

    @Column({ type: 'varchar' })
    eq: string;

    @Column({ type: 'datetime' })
    writetime: string;

    @Column({ type: 'tinyint' })
    room: number;

    @Column({ type: 'tinyint' })
    bed: number;
}

@Entity('hospital_patient_log')
export class Hospital_patient_logEntity {

    @PrimaryGeneratedColumn()
    idx: number;

    @Column({ type: 'varchar' })
    eq: string;

    @Column({ type: 'datetime' })
    writetime: string;

    @Column({ type: 'tinyint' })
    room: number;

    @Column({ type: 'tinyint' })
    bed: number;
}