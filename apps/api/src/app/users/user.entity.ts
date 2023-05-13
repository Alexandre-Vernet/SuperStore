import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users', schema: 'public' })
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'addresses_id', nullable: true, type: 'integer' })
    addressesId: number[];

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    address: string;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
