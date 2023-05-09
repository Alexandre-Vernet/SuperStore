import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../product/product.entity";

@Entity({ name: 'carts', schema: 'public' })
export class Cart {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToMany(type => Product, product => product.id)
    productId: number;

    @Column({ type: 'decimal' })
    quantity: number;

    @Column({ type: 'decimal' })
    totalPrice: number;
}
