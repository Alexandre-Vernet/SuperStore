import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from '@superstore/interfaces';
import { AuthInterceptor } from "../auth/auth.interceptor";
import { AdminInterceptor } from "../auth/admin.interceptor";

@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) {
    }

    @Post()
    create(@Body() order: OrderDto){
        return this.orderService.create(order);
    }

    @UseInterceptors(AdminInterceptor)
    @Get()
    findAll() {
        return this.orderService.findAll();
    }

    @UseInterceptors(AuthInterceptor)
    @Get('user/:userId')
    getUserOrders(@Param('userId') userId: number) {
        return this.orderService.getUserOrders(userId);
    }

    @UseInterceptors(AuthInterceptor)
    @Get(':userId/last')
    findLast(@Param('userId') userId: number) {
        return this.orderService.findLastOrder(userId);
    }

    @UseInterceptors(AuthInterceptor)
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.orderService.findOne(id);
    }

    @UseInterceptors(AdminInterceptor)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateOrderDto: OrderDto) {
        return this.orderService.update(id, updateOrderDto);
    }

    @UseInterceptors(AdminInterceptor)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.orderService.remove(id);
    }
}
