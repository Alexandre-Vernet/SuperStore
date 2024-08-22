import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AddressEntity } from '../address/address.entity';

@Entity({ name: 'users', schema: 'public' })
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToMany(() => AddressEntity, (address) => address.user, { nullable: true, eager: true })
    addresses: AddressEntity[];

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ name: 'is_admin' })
    isAdmin: boolean;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
