import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('ecg_stress')
export class Ecg_stressEntity {

    @PrimaryGeneratedColumn()
    idx: number;

    @Column({ type: 'varchar' })
    eq: string;

    @Column({ type: 'datetime' })
    sDate: string;

    @Column({ type: 'datetime' })
    eDate: string;

    @Column({ type: 'varchar' })
    timezone: string;

    @Column({ type: 'float' })
    mean_RR_ms: number;

    @Column({ type: 'float' })
    std_RR_SDNN_ms: number;

    @Column({ type: 'float' })
    min_HR_beats_min: number;

    @Column({ type: 'float' })
    max_HR_beats_min: number;

    @Column({ type: 'float' })
    rmssd_ms: number;

    @Column({ type: 'float' })
    nn50: number;

    @Column({ type: 'float' })
    pnn50: number;

    @Column({ type: 'float' })
    apen: number;

    @Column({ type: 'float' })
    srd: number;

    @Column({ type: 'float' })
    tsrd: number;

    @Column({ type: 'float' })
    vlf_ms2: number;

    @Column({ type: 'float' })
    lf_ms2: number;

    @Column({ type: 'float' })
    hf_ms2: number;

    @Column({ type: 'float' })
    tp_ms2: number;

    @Column({ type: 'tinyint' })
    analysis_min: number;
}