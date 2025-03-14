import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsUUID } from "class-validator";

type Order = 'ASC' | 'DESC';
type SortField = 'createdAt' | 'deadline' | 'bounty' | 'updatedAt';


export class FindAllTicketsDto {
    @IsOptional()
    @IsUUID()
    userId: string;

    @IsOptional()
    @Transform(({value}) => value || 'DESC' as Order)
    order: Order;

    @IsOptional()
    @Transform(({value}) => value || 'createdAt' as SortField)
    sortBy: SortField = 'createdAt';

    @IsOptional()
    search: string;
}