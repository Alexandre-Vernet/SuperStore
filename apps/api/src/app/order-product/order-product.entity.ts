import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';

@Entity({ name: 'order_products', schema: 'public' })
export class OrderProduct {
    @PrimaryColumn({ name: 'order_id', type: 'integer' })
    orderId: number;

    @PrimaryColumn({ name: 'product_id', type: 'integer' })
    productId: number;

    @OneToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @OneToMany(() => Product, product => product.id)
    @JoinColumn({ name: 'product_id' })
    product: Product[];

    @Column()
    quantity: number;
}
