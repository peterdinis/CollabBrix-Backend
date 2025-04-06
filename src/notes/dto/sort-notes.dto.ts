import { IsEnum, IsOptional } from "class-validator";

export class SortNotesDto {
  @IsOptional()
  @IsEnum(["title", "createdAt"], { message: "sortBy must be 'title' or 'createdAt'" })
  sortBy?: "title" | "createdAt" = "createdAt";

  @IsOptional()
  @IsEnum(["asc", "desc"], { message: "order must be 'asc' or 'desc'" })
  order?: "asc" | "desc" = "desc";
}