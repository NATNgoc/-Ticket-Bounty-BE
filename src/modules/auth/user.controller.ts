import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    @HttpCode(200)
    async getBasicInfo(@Param('id') id: string) {
        return this.userService.getBasicInfo(id);
    }
}
