import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IsLegalSourceGuard } from 'src/common/guards/is-legal-src.guard';
import { TicketService } from '../ticket.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class IsLegalTicketGuard extends IsLegalSourceGuard<TicketService> {
  constructor(reflector: Reflector,service: TicketService) {
    super(reflector, service);
  }
}
