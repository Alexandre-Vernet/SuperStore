import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from "./auth.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    use(req: Request, res: Response, next: NextFunction) {
        const bearer = req.headers.authorization;
        const token = bearer?.split(' ')[1];

        if (token) {
            this.authService.signInWithAccessToken(token)
                .then(() => next())
                .catch(() => res.status(401).send({ message: 'Your session has expired. Please sign in again.' }));
        } else {
            return res.status(401).send({ message: 'Unauthorized' });
        }
    }
}
