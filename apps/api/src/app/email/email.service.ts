import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from "@superstore/libs";
import { HttpService } from "@nestjs/axios";
import { UserService } from "../user/user.service";

@Injectable()
export class EmailService {

    constructor(
        private readonly httpService: HttpService,
        private readonly userService: UserService
    ) {
    }

    sendEmailConfirmationOrder(order: CreateOrderDto) {
        return this.userService.findOne(order.userId)
            .then(user => {
                delete user.password;

                const { EMAIL_SERVICE_URL } = process.env;

                return this.httpService
                    .post(EMAIL_SERVICE_URL, { order, user })
                    .subscribe();
            });
    }
}
