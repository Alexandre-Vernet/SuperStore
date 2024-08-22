import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto, OrderState } from '@superstore/interfaces';
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
    getLastOrder(@Param('userId') userId: number) {
        return this.orderService.getLastOrder(userId);
    }

    @UseInterceptors(AuthInterceptor)
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.orderService.findOne(id);
    }

    @UseInterceptors(AdminInterceptor)
    @Put(':id')
     updateOrderState(@Param('id') id: number, @Body() { state }: { state: OrderState }) {
        return this.orderService.updateOrderState(id, state);
    }

    @UseInterceptors(AdminInterceptor)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.orderService.remove(id);
    }

    @UseInterceptors(AuthInterceptor)
    @Get(':productId/:userId')
    userCanAddReview(@Param('productId') productId: number, @Param('userId') userId: number) {
        return this.orderService.userCanAddReview(productId, userId);
    }
}
