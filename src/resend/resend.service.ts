import { Injectable } from "@nestjs/common";
import { ResendService } from "nestjs-resend";

@Injectable()
export class AppResendService {
    constructor(private readonly resendService: ResendService) {}

    // TODO
    async sendEmail() {}
}