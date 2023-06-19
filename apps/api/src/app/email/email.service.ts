import { Injectable } from '@nestjs/common';
import { CreateOrderDto, NewsletterDto } from "@superstore/interfaces";
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
        return new Promise((resolve, reject) => {
            this.userService.findOne(order.userId)
                .then(user => {
                    const { EMAIL_SERVICE_URL } = process.env;

                    this.httpService
                        .post(EMAIL_SERVICE_URL, { order, user })
                        .subscribe({
                            next: () => {
                                resolve();
                            },
                            error: (err) => {
                                reject(err);
                            }
                        });
                })
                .catch(error => {
                    reject(error);
                })
        });
    }

    sendNewsletter(newsletter: NewsletterDto): Promise<void> {
        return new Promise((resolve, reject) => {
            const { EMAIL_SERVICE_URL } = process.env;

            this.httpService
                .post(`${ EMAIL_SERVICE_URL }/newsletter`, { newsletter })
                .subscribe({
                    next: () => {
                        resolve();
                    },
                    error: (err) => {
                        reject(err);
                    }
                });
        });
    }
}
