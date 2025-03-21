import { Transform, Type } from "class-transformer";
import { IsEnum, IsNumber, IsNumberString, IsOptional, IsUUID } from "class-validator";

type Order = 'ASC' | 'DESC';
type SortField = 'createdAt' | 'deadline' | 'bounty' | 'updatedAt';


export class FindAllTicketsDto {
    @IsOptional()
    @IsUUID()
    userId: string;

    @IsOptional()
    @Transform(({value}) => value || 'DESC' as Order)
    order: Order = "DESC";

    @IsOptional()
    @Transform(({value}) => value || 'createdAt' as SortField)
    sortBy: SortField = 'createdAt';

    @IsOptional()
    search: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)

    offset: number = 0;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
   
    limit: number = 10;
}