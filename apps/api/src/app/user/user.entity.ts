import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users', schema: 'public' })
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

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
