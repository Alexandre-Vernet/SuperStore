import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { returnUnauthorized } from './returnUnauthorized';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<boolean>> {
        const NODE_ENV = process.env.NODE_ENV;
        if (NODE_ENV === 'development') {
            return next.handle();
        }

        const headers = context.switchToHttp().getRequest().headers;
        const bearer = headers.authorization;
        const token = bearer?.split(' ')[1];

        if (!token) {
            returnUnauthorized(context);
            return of(null);
        }

        const { user } = await this.authService.signInWithAccessToken(token);
        if (!user) {
            returnUnauthorized(context, 'Your session has expired. Please sign in again.');
            return of(null);
        }

        return next.handle();
    }
}
