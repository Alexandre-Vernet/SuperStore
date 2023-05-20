import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'orders', schema: 'public' })
export class Order {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'address_id' })
    addressId: number;

    @Column({ name: 'products_id', type: 'integer' })
    productsId: number[];

    @Column()
    state: string;

    @Column({ name: 'delivery_method' })
    deliveryMethod: string;

    @Column({ name: 'payment_method' })
    paymentMethod: string;

    @Column({ name: 'total_price', type: 'decimal' })
    totalPrice: number;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
