import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderState } from '@superstore/interfaces';
import { User } from '../user/user.entity';
import { Address } from '../address/address.entity';
import { OrderProduct } from '../order-product/order-product.entity';
import { Promotion } from "../promotion/promotion.entity";

@Entity({ name: 'orders', schema: 'public' })
export class Order {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne(() => Address, { eager: true })
    @JoinColumn({ name: 'address_id' })
    address: Address;

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.order, { cascade: true, eager: true })
    products: OrderProduct[];

    @OneToOne(() => Promotion, { eager: true })
    @JoinColumn({ name: 'promotion_id' })
    promotion: Promotion;

    @Column({ name: 'state', type: 'text' })
    state: OrderState;

    @Column({ name: 'delivery_method' })
    deliveryMethod: string;

    @Column({ name: 'payment_method' })
    paymentMethod: string;

    @Column({ name: 'sub_total_price', type: 'decimal' })
    subTotalPrice: number;

    @Column({ name: 'shipping_price', type: 'decimal' })
    shippingPrice: number;

    @Column({ name: 'taxes_price', type: 'decimal' })
    taxesPrice: number;

    @Column({ name: 'total_price', type: 'decimal' })
    totalPrice: number;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
