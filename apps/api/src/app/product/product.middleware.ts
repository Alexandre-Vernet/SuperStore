import { NestMiddleware } from '@nestjs/common';
import { ProductDto } from '@superstore/interfaces';
import { CustomBadRequestException } from '../exceptions/CustomBadRequestException';

export class ProductMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: (error?: Error) => void) {
        const slug = this.setSlug(req.body['name']);
        req.body['slug'] = slug;

        const product: ProductDto = {
            id: req.body['id'],
            name: req.body['name'],
            slug,
            description: req.body['description'],
            price: req.body['price'],
            categories: req.body['categories'],
            images: req.body['images'],
        };

        if (!product.name) {
            throw new CustomBadRequestException('Product name is required', 'name');
        }

        if (!product.description) {
            throw new CustomBadRequestException('Product description is required', 'description');
        }

        if (product.price < 0 || !product.price) {
            throw new CustomBadRequestException('Product price is required and must be greater than 0', 'price');
        }

        if (!product.categories || !product.categories.length) {
            throw new CustomBadRequestException('Product categories are required', 'categories');
        }

        if (!product.images || !product.images.length) {
            throw new CustomBadRequestException('Product images are required', 'images');
        }

        next();
    }

    /*Remove all special characters and replace spaces with dash*/
    private setSlug(name: string): string {
        if (!name) {
            return '';
        }
        return name.trim().toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
    }
}