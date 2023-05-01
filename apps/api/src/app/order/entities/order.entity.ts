import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Cart } from "../../cart/entities/cart.entity";

@Entity({ name: 'orders', schema: 'public' })
export class Order {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToMany(type => User, user => user.id)
    user: User;

    @OneToOne(type => Cart, cart => cart.id)
    cart: Cart;

    @Column({ type: 'text' })
    state: string;
}
