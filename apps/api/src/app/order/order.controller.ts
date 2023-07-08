import { Body, Controller, Delete, Get, Param, Post, Put, } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderDto } from '@superstore/interfaces';

@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) {
    }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
        return this.orderService.create(createOrderDto);
    }

    @Get('products')
    findAllOrderWithAddressAndUserAndProducts() {
        return this.orderService.findAllOrderWithAddressAndUserAndProducts();
    }

    @Get()
    findAll() {
        return this.orderService.findAll();
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: number) {
        return this.orderService.findByUser(userId);
    }

    @Get(':userId/last')
    findLast(@Param('userId') userId: number) {
        return this.orderService.findLast(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.orderService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateOrderDto: OrderDto) {
        return this.orderService.update(id, updateOrderDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.orderService.remove(id);
    }
}
