import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Auth = createParamDecorator(
    () => {
        const request = ctx.switchToHttp().getRequest();
        console.log(request)
        return request.user;
    },
);
