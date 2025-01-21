export class NewsletterDto {
    id?: number;
    email: string;
    isSubscribed: boolean;


    constructor(email: string, isSubscribed: boolean) {
        this.email = email;
        this.isSubscribed = isSubscribed;
    }
}

