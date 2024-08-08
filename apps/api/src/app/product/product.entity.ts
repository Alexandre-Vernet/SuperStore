import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderProduct } from '../order-product/order-product.entity';
import { Image } from '../image/image.entity';

@Entity({ name: 'products', schema: 'public' })
export class Product {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToMany(() => OrderProduct, orderProduct => orderProduct.products)
    orderProducts: OrderProduct[];

    @OneToMany(() => Image, image => image.product, { cascade: true, eager: true })
    images: Image[];

    @Column({ type: 'text', unique: true })
    name: string;

    @Column({ type: 'text', unique: true })
    slug: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'decimal' })
    price: number;

    @Column({ type: 'text' })
    categories: string[];

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
