import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Cart } from "../cart/cart.entity";

@Entity({ name: 'orders', schema: 'public' })
export class Order {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'address_id' })
    addressId: number;

    @OneToOne(type => Cart, cart => cart.id)
    cartId: number;

    @Column({ type: 'text' })
    state: string;

    @Column({ name: 'delivery_method', type: 'text' })
    deliveryMethod: string;

    @Column({ name: 'payment_method', type: 'text' })
    paymentMethod: string;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
