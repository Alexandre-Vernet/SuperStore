import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomConflictException extends HttpException {
    constructor(message: string, field: string) {
        super({
            statusCode: HttpStatus.CONFLICT,
            message,
            error: 'Conflict',
            field
        }, HttpStatus.CONFLICT);
    }
}
