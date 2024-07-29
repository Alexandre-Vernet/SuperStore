import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderProduct } from '../order-product/order-product.entity';

@Entity({ name: 'products', schema: 'public' })
export class Product {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToMany(() => OrderProduct, orderProduct => orderProduct.products)
    orderProducts: OrderProduct[];

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    slug: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'decimal' })
    price: number;

    @Column({ type: 'text' })
    categories: string[];

    @Column({ type: 'text' })
    images: string[];

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
