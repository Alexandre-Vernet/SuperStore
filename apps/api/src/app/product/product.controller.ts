import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from '@superstore/interfaces';
import { AdminInterceptor } from '../auth/admin.interceptor';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {
    }

    @UseInterceptors(AdminInterceptor)
    @Post()
    @HttpCode(201)
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
    findAll(): Promise<ProductDto[]> {
        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) : Promise<ProductDto>{
        return this.productService.findBy('id', id);
    }

    @Get('slug/:id')
    findBySlug(@Param('id') slug: string): Promise<ProductDto> {
        return this.productService.findBy('slug', slug);
    }

    @UseInterceptors(AdminInterceptor)
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateProductDto: ProductDto): Promise<ProductDto> {
        return await this.productService.update(id, updateProductDto);
    }

    @UseInterceptors(AdminInterceptor)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.productService.remove(id);
    }
}
