import { Module } from '@nestjs/common';
import { EmailService } from "./email.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [UserModule],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {
}
