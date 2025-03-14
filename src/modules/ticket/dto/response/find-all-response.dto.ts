import { PartialType } from "@nestjs/mapped-types";
import { User } from "src/modules/auth/entities/user.entity";
import { Ticket } from "../../entities/ticket.entity";

export class FindAllResponseDto extends PartialType(Ticket) {
    user: Partial<User>
}