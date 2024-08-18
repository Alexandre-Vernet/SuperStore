import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../product/product.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'reviews', schema: 'public' })
export class ReviewEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => ProductEntity, { eager: true })
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;

    @OneToOne(() => UserEntity, (user) => user.id, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column()
    rating: number;

    @Column({ type: 'text' })
    description: string;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
