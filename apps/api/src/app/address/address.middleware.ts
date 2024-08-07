import { NestMiddleware } from '@nestjs/common';
import { AddressDto } from '@superstore/interfaces';
import { CustomBadRequestException } from '../exceptions/CustomBadRequestException';

export class AddressMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: (error?: Error) => void) {

        const address: AddressDto = {
            id: req.body['id'],
            user: req.body['user'],
            address: req.body['address'],
            apartment: req.body['apartment'],
            company: req.body['company'],
            zipCode: req.body['zipCode'],
            city: req.body['city'],
            country: req.body['country'],
            phone: req.body['phone']
        };

        if (!address.address) {
            throw new CustomBadRequestException('Address is required', 'address');
        }

        if (!address.city) {
            throw new CustomBadRequestException('City is required', 'city');
        }

        if (!address.country) {
            throw new CustomBadRequestException('Country is required', 'country');
        }

        if (!address.zipCode) {
            throw new CustomBadRequestException('Zip code is required', 'zipCode');
        }

        if (!address.phone) {
            throw new CustomBadRequestException('Phone is required', 'phone');
        }

        next();
    }
}