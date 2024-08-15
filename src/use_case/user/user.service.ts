import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class UserService { 

    constructor(private readonly databaseService: DatabaseService) {}

    async getUser(user: string) {
        return await this.databaseService.getUser(user);
    }
}
