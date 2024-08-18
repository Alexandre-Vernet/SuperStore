import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from '../order/order.entity';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'order_products', schema: 'public' })
export class OrderProductEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => OrderEntity, order => order.products)
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, { cascade: true, eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;

    @Column()
    quantity: number;

    @Column({ nullable: true, length: 3 })
    size: string;
}
