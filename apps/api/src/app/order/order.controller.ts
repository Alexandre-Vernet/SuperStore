import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from '@superstore/libs';
import { OrderDto } from '@superstore/libs';

@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) {
    }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
        return this.orderService.create(createOrderDto);
    }

    @Get()
    findAll() {
        return this.orderService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateOrderDto: OrderDto) {
        return this.orderService.update(+id, updateOrderDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderService.remove(+id);
    }
}
