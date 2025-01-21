import { HttpException, Injectable } from '@nestjs/common';
import { OrderDto, SendNewsletterDto, Transporter, UserDto } from '@superstore/interfaces';
import { sendNewsletter } from './html_templates/send-newsletter';
import { confirmOrder } from './html_templates/confirm-order';
import { sendEmailResetPassword } from './html_templates/send-email-reset-password';
import { sendContactEmail } from './html_templates/sendContactEmail';

@Injectable()
export class EmailService {
    nodemailer = require('nodemailer');
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

    sendEmailConfirmationOrder(order: OrderDto, pdfBuffer: Buffer) {
        const mailOptions = {
            from: 'superstore@gmail.com',
            to: order.user.email,
            subject: 'Order Confirmation',
            html: confirmOrder(order),
            attachments: [
                {
                    filename: `invoice-${ new Date().getTime() }.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
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
        const mailOptionsBase = {
            from: 'superstore@gmail.com',
            subject: newsletter.title,
        };

        const dailyLimit = 200;
        const delayBetweenEmails = 60000;   // 1 minute
        const emails = newsletter.emails;
        const totalEmails = emails.length;
        let currentIndex = 0;

        const sendBatch = () => {
            let emailsSentToday = 0;

            const sendNextEmail = () => {
                if (currentIndex >= totalEmails || emailsSentToday >= dailyLimit) {
                    if (currentIndex < totalEmails) {
                        console.log(`Waiting 24 hours for the next batch...`);
                        setTimeout(sendBatch, 24 * 60 * 60 * 1000); // Wait 24 hours before sending the next batch
                    } else {
                        console.log('All emails sent successfully.');
                    }
                    return;
                }

                const email = emails[currentIndex];
                const mailOptions = {
                    ...mailOptionsBase,
                    to: email,
                    html: sendNewsletter(email, newsletter.title, newsletter.description),
                };

                this.transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        console.error(`Error sending email to ${email}:`, error);
                    } else {
                        console.log(`Email sent successfully to ${email}`);
                    }
                });

                currentIndex++;
                emailsSentToday++;
                setTimeout(sendNextEmail, delayBetweenEmails);
            };

            sendNextEmail();
        };

        sendBatch();
    }


    sendEmailResetPassword(user: UserDto, linkResetPassword: string) {
        const mailOptions = {
            from: 'superstore@gmail.com',
            to: user.email,
            subject: 'Reset Password',
            html: sendEmailResetPassword(user, linkResetPassword)
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

    sendContactEmail({ firstName, lastName, email, phone, subject, message }: {
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        subject: string,
        message: string
    }) {
        const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
        const mailOptions = {
            from: email,
            to: NODEMAILER_EMAIL,
            subject: subject,
            html: sendContactEmail(firstName, lastName, email, phone, subject, message)
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
}
