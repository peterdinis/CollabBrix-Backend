import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";

@Module({
    imports: [PrismaModule],
    controllers: [DocumentsController],
    providers: [DocumentsService]
})

export class DocumentsModule {}