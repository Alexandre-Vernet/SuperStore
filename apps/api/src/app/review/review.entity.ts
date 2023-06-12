import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'reviews', schema: 'public' })
export class Review {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'product_id' })
    productId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column()
    rating: number;

    @Column({ type: 'text' })
    description: string;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
