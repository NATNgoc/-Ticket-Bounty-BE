import { SelectQueryBuilder } from "typeorm";

export type PaginationMeta = {
    total: number,
    curPage: number,
    totalPage: number,
    next: boolean | null,
    previous: boolean | null,
    limit: number,   
}

export type PaginationResult<T> = {
    data: T[],
    meta: PaginationMeta
}

export async function paginate<T>(
    queryBuiler: SelectQueryBuilder<T>,
    page: number,
    limit: number,
): Promise<PaginationResult<T>| null> {
        const [data, total] = await queryBuiler.skip(page * limit).take(limit).getManyAndCount()
        const totalPage = Math.ceil(total / limit)
        const next = page < totalPage - 1 ? true : false
        const previous = (page > 0 && totalPage!=0) ? true : false
        return {
            data: data,
            meta: {
                total: total,
                curPage: page,
                totalPage: totalPage,
                next: next,
                previous: previous,
                limit: limit
            }
        } 
}