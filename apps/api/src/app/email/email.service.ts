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
        this.userService.findOne(order.userId)
            .then(user => {
                delete user.password;

                this.httpService
                    .post('http://localhost:3333/api/superstore', { order, user })
                    .subscribe({
                        next: () => {
                            console.log('success');
                        },
                        error: (error) => {
                            console.error(error);
                        }
                    });
            });
    }
}
