import { Exclude } from 'class-transformer';
import { TicketStatus } from 'src/common/enum';
import BaseEntity from 'src/core/base/entity/entity';
import { User } from 'src/modules/auth/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('tickets')
@Index(["user"])
export class Ticket extends BaseEntity {
  @Column({ type: 'varchar', length: 60 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  content: string;

  @Column({ type: 'enum', enum: TicketStatus, default: 'OPEN' })
  status: string;

  @Column({
    type: "date",
    // nullable: true
  })
  deadline: Date

  @ManyToOne(() => User, user => user.tickets, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "user_id", type: 'uuid' })
  user_id: string;

  @Column({
    type: "money",
    // nullable: true
  })
  bounty: number
}


