import { Module } from '@nestjs/common';
import { EmailService } from "./email.service";
import { HttpModule } from "@nestjs/axios";
import { UserModule } from "../user/user.module";

@Module({
    imports: [HttpModule, UserModule],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {
}
