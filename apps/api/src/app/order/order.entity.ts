import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderState } from '@superstore/interfaces';
import { UserEntity } from '../user/user.entity';
import { AddressEntity } from '../address/address.entity';
import { OrderProductEntity } from '../order-product/order-product.entity';
import { PromotionEntity } from "../promotion/promotion.entity";

@Entity({ name: 'orders', schema: 'public' })
export class OrderEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => UserEntity, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @OneToOne(() => AddressEntity, { eager: true })
    @JoinColumn({ name: 'address_id' })
    address: AddressEntity;

    @OneToMany(() => OrderProductEntity, orderProduct => orderProduct.order, { cascade: true, eager: true })
    products: OrderProductEntity[];

    @OneToOne(() => PromotionEntity, { eager: true })
    @JoinColumn({ name: 'promotion_id' })
    promotion: PromotionEntity;

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
