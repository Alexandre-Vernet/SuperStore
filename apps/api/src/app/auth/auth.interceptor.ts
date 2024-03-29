import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements NestInterceptor {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<ExecutionContext> | Promise<Observable<ExecutionContext>> {
        const NODE_ENV = process.env.NODE_ENV;
        if (NODE_ENV === 'development') {
            return next.handle();
        }

        const headers = context.switchToHttp().getRequest().headers;
        const bearer = headers.authorization;
        const token = bearer?.split(' ')[1];
        if (token) {
            this.authService.signInWithAccessToken(token)
                .then(() => next.handle())
                .catch(() => {
                    const message = 'Your session has expired. Please sign in again.'
                    AuthInterceptor.returnUnauthorized(context, message);
                });
        }
        AuthInterceptor.returnUnauthorized(context);
    }


    static returnUnauthorized(context: ExecutionContext, message = 'Unauthorized') {
        const response = context.switchToHttp().getResponse();
        response.status(401).send({ message });
    }
}
