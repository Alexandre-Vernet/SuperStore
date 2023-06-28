import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto, SendNewsletterDto } from "@superstore/interfaces";
import { HttpService } from "@nestjs/axios";
import { UserService } from "../user/user.service";

@Injectable()
export class EmailService {

    constructor(
        private readonly httpService: HttpService,
        private readonly userService: UserService
    ) {
    }

    sendEmailConfirmationOrder(order: CreateOrderDto): Promise<void> {
        return this.userService.findOne(order.userId)
            .then(user => {
                const { EMAIL_SERVICE_URL } = process.env;

                this.httpService
                    .post(EMAIL_SERVICE_URL, { order, user })
                    .subscribe({
                        next: () => {
                            return;
                        },
                        error: (err) => {
                            throw new HttpException(err, 500);
                        }
                    });
            })
            .catch(error => {
                throw new HttpException(error, 500);
            })
    }

    sendNewsletter(newsletter: SendNewsletterDto) {
        const { EMAIL_SERVICE_URL } = process.env;

        return this.httpService
            .post(`${ EMAIL_SERVICE_URL }/newsletter`, { newsletter })
            .subscribe({
                next: () => {
                    return;
                },
                error: () => {
                    throw new HttpException('Error sending newsletter', 500);
                }
            });
    }
}
