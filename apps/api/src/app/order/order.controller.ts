import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto, OrderState } from '@superstore/interfaces';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AdminInterceptor } from '../auth/admin.interceptor';
import { EmailService } from '../email/email.service';

@Controller('order')
export class OrderController {

    constructor(
        private readonly orderService: OrderService,
        private readonly emailService: EmailService,
    ) {
    }

    @Post()
    create(@Body() order: OrderDto) {
        return this.orderService.create(order);
    }

    @Post('invoice')
    sendEmailConfirmationOrder(@Body() { order, invoice }: { order: OrderDto, invoice: string }) {
        const pdfBuffer = Buffer.from(invoice, 'base64');
        return this.emailService.sendEmailConfirmationOrder(order, pdfBuffer);
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
