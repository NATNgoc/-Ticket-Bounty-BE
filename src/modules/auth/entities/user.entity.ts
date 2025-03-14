import { Exclude } from "class-transformer";
import BaseEntity from "src/core/base/entity/entity";
import { Ticket } from "src/modules/ticket/entities/ticket.entity";
import { Column, Entity, OneToMany } from "typeorm";


@Entity({
    name: "users"
})
export class User extends BaseEntity {
    
    @Column({
        type: "varchar",
    })
    name: string;

    @Column({
        type: "varchar",
        unique: true
    })
    email: string;

    @Exclude()
    @Column({
        type: "varchar"
    })
    password: string;

    @OneToMany(() => Ticket, (ticket: Ticket) => ticket.user)
    tickets: Ticket[];

    @Exclude()
    @Column({
        type: "varchar",
        nullable: true
    })
    refreshToken: string;
}