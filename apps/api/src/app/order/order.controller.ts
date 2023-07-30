import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderDto } from '@superstore/interfaces';
import { AuthInterceptor } from "../auth/auth.interceptor";

@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) {
    }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
        return this.orderService.create(createOrderDto);
    }

    @UseInterceptors(AuthInterceptor)
    @Get('products')
    findAllOrderWithAddressAndUserAndProducts() {
        return this.orderService.findAllOrderWithAddressAndUserAndProducts();
    }

    @UseInterceptors(AuthInterceptor)
    @Get()
    findAll() {
        return this.orderService.findAll();
    }

    @UseInterceptors(AuthInterceptor)
    @Get('user/:userId')
    findByUser(@Param('userId') userId: number) {
        return this.orderService.findByUser(userId);
    }

    @UseInterceptors(AuthInterceptor)
    @Get(':userId/last')
    findLast(@Param('userId') userId: number) {
        return this.orderService.findLast(userId);
    }

    @UseInterceptors(AuthInterceptor)
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.orderService.findOne(id);
    }

    @UseInterceptors(AuthInterceptor)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateOrderDto: OrderDto) {
        return this.orderService.update(id, updateOrderDto);
    }

    @UseInterceptors(AuthInterceptor)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.orderService.remove(id);
    }
}
