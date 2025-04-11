import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Documents")
@Controller("documents")
export class DocumentsController {}