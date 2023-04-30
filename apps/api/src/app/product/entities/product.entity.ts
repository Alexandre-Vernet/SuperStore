import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'products', schema: 'public' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'integer' })
    price: number;

    @Column({ type: 'json' })
    category: string[];
}
