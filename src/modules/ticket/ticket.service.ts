import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/modules/ticket/entities/ticket.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { User } from '../auth/entities/user.entity';
import { FindAllTicketsDto } from './dto/find-all-tickets.dto';
import { paginate } from 'src/common/helper/pagination.helper';

@Injectable()
export class TicketService implements BaseService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) { }


  async findOneByResourceIdAndUserId(srcid: string, userId: string): Promise<Ticket> {
    return await this.ticketRepository.findOneBy({id: srcid, user_id: userId});
  }

  async create(user: User,createTicketDto: CreateTicketDto): Promise<Ticket> {
    const newTicket = this.ticketRepository.create({
      ...createTicketDto,
      user: user,
    });
    const result = await this.ticketRepository.save(newTicket);
    return result;
  }

  async findAll(dto: FindAllTicketsDto): Promise<ReturnType<typeof paginate<Ticket>>> {
    const queryBuilder = this.ticketRepository.createQueryBuilder('ticket');    
    if (dto.userId) {
      queryBuilder.where('ticket.user_id = :userId', { userId: dto.userId });
    }
    if (dto.search) {
      queryBuilder.where('ticket.title LIKE :search', {
        search: `%${dto.search}%`
      })
    }
    queryBuilder.leftJoinAndSelect('ticket.user', 'user')
    .addSelect(['user.id', 'user.name']);
    queryBuilder.orderBy(`ticket.${dto.sortBy}`, dto.order);
    return await paginate<Ticket>(queryBuilder, dto.offset, dto.limit)
  }


  async findOne(
    id: string,
    withThrowingError: boolean = false,
  ): Promise<Ticket> {
    const isExising = await this.ticketRepository.findOne({
      where: { id },
      relations: ["user"]
    });
    if (withThrowingError && !isExising) {
      throw new NotFoundException(`Ticket #${id} not found`);
    }
    return isExising;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const isExisingTicket = await this.ticketRepository.preload({
      id: id,
      ...updateTicketDto,
    })
    if (!isExisingTicket) {
      throw new NotFoundException(`Ticket #${id} not found`);
    }
    return this.ticketRepository.save(isExisingTicket);
  }

  async remove(id: string) {
    const ticket = await this.findOne(id.toString(), true);
    return this.ticketRepository.remove(ticket);
  }

}
