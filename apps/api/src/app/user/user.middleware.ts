import { NestMiddleware } from '@nestjs/common';
import { UserDto } from '@superstore/interfaces';
import { CustomBadRequestException } from '../exceptions/CustomBadRequestException';

export class UserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: (error?: Error) => void) {
        const user: Omit<UserDto, 'password' | 'addresses'> = {
            id: req.body['id'],
            firstName: req.body['firstName'],
            lastName: req.body['lastName'],
            email: req.body['email'],
            isAdmin: req.body['isAdmin']
        }

        if (!user.firstName) {
            throw new CustomBadRequestException('First name is required', 'firstName');
        }

        if (!user.lastName) {
            throw new CustomBadRequestException('Last name is required', 'lastName');
        }

        if (!user.email) {
            throw new CustomBadRequestException('Email is required', 'email');
        }

        if (typeof user.isAdmin !== 'boolean') {
            throw new CustomBadRequestException('Is admin is required', 'isAdmin');
        }


        next();
    }
}