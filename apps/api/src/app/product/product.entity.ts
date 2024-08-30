import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ImageEntity } from '../image/image.entity';
import { ReviewEntity } from '../review/review.entity';

@Entity({ name: 'products', schema: 'public' })
export class ProductEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToMany(() => ImageEntity, image => image.product, { cascade: true, eager: true })
    images: ImageEntity[];

    @OneToMany(() => ReviewEntity, review => review.product)
    reviews: ReviewEntity[];

    @Column({ type: 'text', unique: true })
    name: string;

    @Column({ type: 'text', unique: true })
    slug: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'decimal' })
    price: number;

    @Column()
    category: string;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
