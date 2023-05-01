import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Product } from "../../product/entities/product.entity";

@Entity({ name: 'carts', schema: 'public' })
export class Cart {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToMany(type => Product, product => product.id)
    product: Product[];

    @OneToOne(type => User, user => user.id)
    user: Product;
}
