import { Transform, Type } from 'class-transformer';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate, Min, minDate, MinDate } from 'class-validator';
import { TicketStatus } from 'src/common/enum';
import { getYesterday } from 'src/common/utils';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(TicketStatus)
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  status: string = TicketStatus.OPEN;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @MinDate(getYesterday(), { message: 'Deadline must be after current date' })
  deadline: Date;

  @IsNumber()
  @IsNotEmpty()
  bounty: number;

}
