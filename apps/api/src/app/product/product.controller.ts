import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors, } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from '@superstore/interfaces';
import { AuthInterceptor } from "../auth/auth.interceptor";
import { AdminInterceptor } from "../auth/admin.interceptor";

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {
    }

    @UseInterceptors(AdminInterceptor)
    @Post()
    create(@Body() createProductDto: ProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get('pagination')
    findAllProductsWithPagination(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        const pagination = {
            page,
            limit,
        };

        return this.productService.findAllProductsWithPagination(pagination);
    }

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.productService.findOne(id);
    }

    @Get('slug/:id')
    findBySlug(@Param('id') slug: string) {
        return this.productService.findBySlug(slug);
    }

    @UseInterceptors(AdminInterceptor)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateProductDto: ProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @UseInterceptors(AdminInterceptor)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.productService.remove(id);
    }
}
