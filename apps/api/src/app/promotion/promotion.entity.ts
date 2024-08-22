import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'promotions', schema: 'public' })
export class PromotionEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'text', unique: true })
    label: string;

    @Column({ type: 'decimal' })
    amount: number;

    @Column({ type: 'integer' })
    count: number;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
