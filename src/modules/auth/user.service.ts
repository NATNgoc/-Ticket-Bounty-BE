import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
    async getBasicInfo(id: string): Promise<User> {  
        const isExisingUser =  await this.userRepository.findOneBy({
            id: id
        });
        if (!isExisingUser) {
            throw new NotFoundException('User not found');
        }
        return isExisingUser
    }
}
