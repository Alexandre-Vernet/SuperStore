import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'product_size', schema: 'public' })
export class ProductSize {
    @PrimaryColumn()
    id: number;

    @Column()
    tag: string;

    @Column()
    name: string;
}
