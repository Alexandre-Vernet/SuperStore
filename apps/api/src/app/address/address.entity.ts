import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'addresses', schema: 'public' })
export class Address {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

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

    @Column({ name: 'zip_code' })
    zipCode: string;

    @Column()
    phone: string;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
