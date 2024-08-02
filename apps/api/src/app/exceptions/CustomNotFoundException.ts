import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomNotFoundException extends HttpException {
    constructor(message: string, field: string) {
        super({
            statusCode: HttpStatus.NOT_FOUND,
            message,
            error: 'Not found',
            field
        }, HttpStatus.CONFLICT);
    }
}
