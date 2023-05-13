import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'addresses', schema: 'public' })
export class Address {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ nullable: true })
    company: string;

    @Column()
    address: string;

    @Column({ nullable: true })
    apartment: string;

    @Column()
    country: string;

    @Column()
    city: string;

    @Column({ name: 'postal_code' })
    postalCode: string;

    @Column()
    phone: string;
}
