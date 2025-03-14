import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Ticket } from 'src/modules/ticket/entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketService } from './ticket.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CheckExistUserGuard } from '../auth/guards/check-exist-user.guard';
import { Request } from 'express';
import { User } from '../auth/entities/user.entity';
import { FindAllTicketsDto } from './dto/find-all-tickets.dto';
import { IsPublic } from 'src/common/decorators/isPublic.decorator';
import { KEY_ID_DECORATOR_KEY } from 'src/common/constants';
import { IsLegalSourceGuard } from 'src/common/guards/is-legal-src.guard';
import { IsLegalTicketGuard } from './guards/check-legal-ticket.guard';

@Controller('tickets')
@UseGuards(JwtGuard, CheckExistUserGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createTicketDto: CreateTicketDto, @Req() req: Request): Promise<Ticket> {
    const user = req.user!! as User
    return await this.ticketService.create(user ,createTicketDto);
  }

  @Get()
  @IsPublic()
  async findAll(@Query() queryData: FindAllTicketsDto) {
    return await this.ticketService.findAll(queryData);
  }

  @Get(':id')
  @IsPublic()
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Ticket> {
    return await this.ticketService.findOne(id, true);
  }

  @Patch(':id')
  @HttpCode(201)
  @UseGuards(IsLegalTicketGuard)
  @SetMetadata(KEY_ID_DECORATOR_KEY, "id")
  async update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    // await new Promise((resolve) => setTimeout(resolve, 5000)); 
    // throw "Ngu"
     
    return await this.ticketService.update(id, updateTicketDto);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(IsLegalTicketGuard)
  @SetMetadata(KEY_ID_DECORATOR_KEY, "id")
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    // throw "Ngu"
    return await this.ticketService.remove(id);
  }
}
