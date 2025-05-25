import { Entity, Column, PrimaryGeneratedColumn,  CreateDateColumn, UpdateDateColumn,  } from 'typeorm';

@Entity('contacts')
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
}