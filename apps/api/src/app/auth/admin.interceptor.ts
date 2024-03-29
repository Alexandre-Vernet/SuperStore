import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { AuthInterceptor } from "./auth.interceptor";

@Injectable()
export class AdminInterceptor implements NestInterceptor {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        const headers = context.switchToHttp().getRequest().headers;
        const bearer = headers.authorization;
        const token = bearer?.split(' ')[1];

        if (token) {
            return this.authService.signInWithAccessToken(token)
                .then(({ user }) => {
                    if (user.isAdmin === true) {
                        next.handle().subscribe();
                    } else {
                        AuthInterceptor.returnUnauthorized(context);
                    }
                })
                .catch(() => {
                    AuthInterceptor.returnUnauthorized(context);
                });
        } else {
            AuthInterceptor.returnUnauthorized(context);
        }
    }
}
