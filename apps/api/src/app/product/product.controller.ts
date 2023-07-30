import { Body, Controller, Delete, Get, Param, Post, Put, Query, } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductDto } from '@superstore/interfaces';
import { AuthMiddleware } from "../auth/auth.middleware";
import { Auth } from "../auth/auth.decorator";

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {
    }

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
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

    @Auth('azdaz')
    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Post('get-by-ids')
    getProductsByIds(@Body('ids') ids: number[]) {
        return this.productService.getProductsByIds(ids);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.productService.findOne(id);
    }

    @Get('slug/:id')
    findBySlug(@Param('id') slug: string) {
        return this.productService.findBySlug(slug);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateProductDto: ProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.productService.remove(id);
    }
}
