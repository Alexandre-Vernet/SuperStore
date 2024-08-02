import { ExecutionContext } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

export const returnUnauthorized = (context: ExecutionContext, message = 'Unauthorized') => {
    const response = context.switchToHttp().getResponse();
    response.status(HttpStatusCode.Unauthorized).send({ message });
}