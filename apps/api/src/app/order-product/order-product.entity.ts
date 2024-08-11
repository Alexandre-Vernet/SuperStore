import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';

@Entity({ name: 'order_products', schema: 'public' })
export class OrderProduct {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Order, order => order.products)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Product, { cascade: true, eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
