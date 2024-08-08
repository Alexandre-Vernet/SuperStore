import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity({ name: 'images', schema: 'public' })
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.images)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'text' })
    url: string;
}