import { HttpException, Injectable } from '@nestjs/common';
import { Transporter, OrderDto, SendNewsletterDto, UserDto } from "@superstore/interfaces";
import { sendNewsletter } from "./html_templates/send-newsletter";
import { confirmOrder } from "./html_templates/confirm-order";

@Injectable()
export class EmailService {
    nodemailer = require("nodemailer");
    transporterOptions: Transporter = {
        auth: {
            user: '',
            pass: ''
        }
    };

    constructor() {
        this.initTransporter();
    }

    initTransporter() {
        const { MAIL_USER, MAIL_PASSWORD, NODE_ENV } = process.env;

        if (NODE_ENV === 'production') {
            this.transporterOptions = {
                auth: {
                    user: MAIL_USER,
                    pass: MAIL_PASSWORD
                },
                service: 'gmail'
            };

        } else {
            this.transporterOptions = {
                auth: {
                    user: MAIL_USER,
                    pass: MAIL_PASSWORD
                },
                host: 'sandbox.smtp.mailtrap.io',
                port: 2525
            }
        }
    }

    sendEmailConfirmationOrder(order: OrderDto, user: UserDto) {
        const transporter = this.nodemailer.createTransport(this.transporterOptions);

        const mailOptions = {
            from: 'superstore@gmail.com',
            to: user.email,
            subject: 'Order Confirmation',
            html: confirmOrder(order, user),
        };

        return transporter
            .sendMail(mailOptions, (error) => {
                if (error) {
                    throw new HttpException(error, 500, { cause: error })
                } else {
                    return { message: 'Email sent successfully' };
                }
            });
    }

    sendNewsletter(newsletter: SendNewsletterDto) {
        const transporter = this.nodemailer.createTransport(this.transporterOptions);

        const mailOptions = {
            from: 'superstore@gmail.com',
            to: newsletter.emails,
            subject: newsletter.title,
            html: sendNewsletter(newsletter.title, newsletter.description),
        };

        return transporter
            .sendMail(mailOptions, (error) => {
                if (error) {
                    throw new HttpException(error, 500, { cause: error })
                } else {
                    return { message: 'Email sent successfully' };
                }
            });
    }
}
