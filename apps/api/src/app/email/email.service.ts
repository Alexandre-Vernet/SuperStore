import { HttpException, Injectable } from '@nestjs/common';
import { Transporter, OrderDto, SendNewsletterDto, UserDto } from "@superstore/interfaces";
import { sendNewsletter } from "./html_templates/send-newsletter";
import { confirmOrder } from "./html_templates/confirm-order";
import { sendEmailResetPassword } from "./html_templates/send-email-reset-password";

@Injectable()
export class EmailService {
    nodemailer = require("nodemailer");
    transporter;
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

        this.transporter = this.nodemailer.createTransport(this.transporterOptions)
    }

    sendEmailConfirmationOrder(order: OrderDto, user: UserDto) {
        const mailOptions = {
            from: 'superstore@gmail.com',
            to: user.email,
            subject: 'Order Confirmation',
            html: confirmOrder(order, user),
        };

        return this.transporter
            .sendMail(mailOptions, (error) => {
                if (error) {
                    throw new HttpException(error, 500, { cause: error })
                } else {
                    return { message: 'Email sent successfully' };
                }
            });
    }

    sendNewsletter(newsletter: SendNewsletterDto) {
        const mailOptions = {
            from: 'superstore@gmail.com',
            to: newsletter.emails,
            subject: newsletter.title,
            html: sendNewsletter(newsletter.title, newsletter.description),
        };

        return this.transporter
            .sendMail(mailOptions, (error) => {
                if (error) {
                    throw new HttpException(error, 500, { cause: error })
                } else {
                    return { message: 'Email sent successfully' };
                }
            });
    }

    sendEmailResetPassword(user: UserDto, linkResetPassword: string) {
        const mailOptions = {
            from: 'superstore@gmail.com',
            to: user.email,
            subject: 'Reset Password',
            html: sendEmailResetPassword(user, linkResetPassword),
        };

        return this.transporter
            .sendMail(mailOptions, (error) => {
                if (error) {
                    throw new HttpException(error, 500, { cause: error })
                } else {
                    return { message: 'Email sent successfully' };
                }
            });
    }
}
