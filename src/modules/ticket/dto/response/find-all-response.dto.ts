import { PartialType } from "@nestjs/mapped-types";
import { Ticket } from "../../entities/ticket.entity";
import { User } from "src/modules/auth/entities/user.entity";

export class FindAllResponseDto extends PartialType(Ticket) {
    User: Partial<User>
}