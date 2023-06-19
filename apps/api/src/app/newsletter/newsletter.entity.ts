import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'newsletter', schema: 'public' })
export class Newsletter {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    email: string;

    @Column({ name: 'is_subscribed', default: true })
    isSubscribed: boolean;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
