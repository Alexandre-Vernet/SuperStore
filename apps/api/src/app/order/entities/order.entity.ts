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
}
