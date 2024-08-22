import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { returnUnauthorized } from './returnUnauthorized';

@Injectable()
export class AdminInterceptor implements NestInterceptor {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<boolean>> {
        const request = context.switchToHttp().getRequest();
        const headers = request.headers;
        const bearer = headers.authorization;
        const token = bearer?.split(' ')[1];

        if (!token) {
            returnUnauthorized(context);
            return of(false);
        }

        const { user } = await this.authService.signInWithAccessToken(token);
        if (user.isAdmin) {
            return next.handle();
        } else {
            returnUnauthorized(context);
            return of(false);
        }
    }
}
