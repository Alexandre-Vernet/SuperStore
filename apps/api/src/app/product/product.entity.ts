import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'products', schema: 'public' })
export class Product {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'integer' })
    price: number;

    @Column({ type: 'text' })
    category: string[];
}
