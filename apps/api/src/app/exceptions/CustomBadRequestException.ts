import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomBadRequestException extends HttpException {
    constructor(message: string, field: string) {
        super({
            statusCode: HttpStatus.BAD_REQUEST,
            message,
            error: 'Bad request',
            field
        }, HttpStatus.BAD_REQUEST);
    }
}
