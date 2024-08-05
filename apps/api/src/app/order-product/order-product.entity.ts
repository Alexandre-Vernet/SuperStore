import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';

@Entity({ name: 'order_products', schema: 'public' })
export class OrderProduct {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Order, order => order.orderProducts)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToMany(() => Product, product => product.orderProducts)
    @JoinTable({
        name: 'order_product_products',
        joinColumn: { name: 'order_product_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' }
    })
    products: Product[];
}
