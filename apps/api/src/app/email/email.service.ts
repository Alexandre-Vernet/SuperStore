import { HttpException, Injectable } from '@nestjs/common';
import { Transporter, OrderDto, SendNewsletterDto, UserDto } from "@superstore/interfaces";
import { sendNewsletter } from "./html_templates/send-newsletter";
import { confirmOrder } from "./html_templates/confirm-order";
import { sendEmailResetPassword } from "./html_templates/send-email-reset-password";
import { sendContactEmail } from "./html_templates/sendContactEmail";

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
        const { NODEMAILER_USERNAME, NODEMAILER_PASSWORD, NODE_ENV } = process.env;

        if (NODE_ENV === 'production') {
            this.transporterOptions = {
                auth: {
                    user: NODEMAILER_USERNAME,
                    pass: NODEMAILER_PASSWORD
                },
                service: 'gmail'
            };

        } else {
            this.transporterOptions = {
                auth: {
                    user: NODEMAILER_USERNAME,
                    pass: NODEMAILER_PASSWORD
                },
                host: 'sandbox.smtp.mailtrap.io',
                port: 2525
            };
        }

        this.transporter = this.nodemailer.createTransport(this.transporterOptions);
    }

    sendEmailConfirmationOrder(order: OrderDto) {
        const mailOptions = {
            from: 'superstore@gmail.com',
            to: order.user.email,
            subject: 'Order Confirmation',
            html: confirmOrder(order),
        };

        return this.transporter
            .sendMail(mailOptions, (error) => {
                if (error) {
                    throw new HttpException(error, 500, { cause: error });
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
                    throw new HttpException(error, 500, { cause: error });
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
                    throw new HttpException(error, 500, { cause: error });
                } else {
                    return { message: 'Email sent successfully' };
                }
            });
    }

    sendContactEmail({ email, firstName, lastName, phone, subject, message }) {
        const NODE_ENV = process.env.NODE_ENV;
        if (NODE_ENV === 'production') {
            const mailOptions = {
                from: email,
                to: this.transporterOptions.auth.user,
                subject: subject,
                html: sendContactEmail(firstName, lastName, email, phone, subject, message),
            };

            return this.transporter
                .sendMail(mailOptions, (error) => {
                    if (error) {
                        throw new HttpException(error, 500, { cause: error });
                    } else {
                        return { message: 'Email sent successfully' };
                    }
                });
        } else {
            throw new HttpException("Email not sent in development mode", 500);
        }
    }
}
