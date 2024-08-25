import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'newsletter', schema: 'public' })
export class NewsletterEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => UserEntity, (user) => user.email, { nullable: true })
    email: string;

    @Column({ name: 'is_subscribed', default: false })
    isSubscribed: boolean;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
