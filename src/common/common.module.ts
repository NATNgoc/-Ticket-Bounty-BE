import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalFilter } from './filters/global.filter';

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: GlobalFilter
        }
    ],
    // exports: [GlobalFilter]
})
export class CommonModule {}
