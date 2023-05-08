import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Cart } from "../../cart/entities/cart.entity";

@Entity({ name: 'orders', schema: 'public' })
export class Order {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToMany(type => User, user => user.id)
    userId: number;

    @OneToOne(type => Cart, cart => cart.id)
    cartId: number;

    @Column({ type: 'text' })
    state: string;

    @Column({ type: 'text', nullable: true })
    company: string;

    @Column({ type: 'text' })
    address: string;

    @Column({ type: 'text', nullable: true })
    apartment: string;

    @Column({ type: 'text' })
    country: string;

    @Column({ type: 'text' })
    city: string;

    @Column({ name: 'post_code', type: 'text' })
    postalCode: string;

    @Column({ type: 'integer' })
    phone: string;

    @Column({ name: 'delivery_method', type: 'text' })
    deliveryMethod: string;

    @Column({ name: 'payment_method', type: 'text' })
    paymentMethod: string;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
