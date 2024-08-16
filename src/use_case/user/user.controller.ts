import { Controller, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/get/:id')
    async getUser(@Param('id') id: string) {
        return this.userService.getUser(id);
    }

    @Get('/get_user_friends/:id')
    async getUserFriends(@Param('id') id: string) {
        return this.userService.getUserFriends(id);
    }
}
