import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'images', schema: 'public' })
export class ImageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProductEntity, product => product.images)
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;

    @Column({ type: 'text' })
    url: string;
}