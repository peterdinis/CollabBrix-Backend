import { Module } from "@nestjs/common";
import { ResendModule } from 'nestjs-resend';
import { AppResendService } from "./resend.service";

@Module({
    imports: [
        ResendModule.forRootAsync({
            useFactory: async () => ({
                apiKey: process.env.RESEND_API_KEY
            })
        }),
    ],
    providers: [AppResendService],
    exports: [AppResendService]
})

export class AppResendModule { }