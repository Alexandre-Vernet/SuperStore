import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'addresses', schema: 'public' })
export class Address {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

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
