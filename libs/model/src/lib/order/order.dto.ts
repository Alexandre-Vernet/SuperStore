import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class OrderDto extends PartialType(CreateOrderDto) {
    id: number;
    createdAt: Date;
}
