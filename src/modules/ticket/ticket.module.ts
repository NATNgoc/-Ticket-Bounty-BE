import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/modules/ticket/entities/ticket.entity';
import { IsLegalSourceGuard } from 'src/common/guards/is-legal-src.guard';
import { IsLegalTicketGuard } from './guards/check-legal-ticket.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  controllers: [TicketController],
  providers: [IsLegalTicketGuard, TicketService],
  exports: [TicketService],
})
export class TicketModule {}
