import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { PostUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/get/:id')
    async getUser(@Param('id') id: string) {
        return this.userService.getUser(id);
    }

    @Post('/post/:id')
    async updateUser(@Param('id') id: string, @Body() postUserDto: PostUserDto) {
        const {bio, location, gender, fav_playlist, dob} = postUserDto;
        return this.userService.updateUser(id, bio, location, gender, fav_playlist, dob);
    }
  
    @Get('/get_user_friends/:id')
    async getUserFriends(@Param('id') id: string) {
        return this.userService.getUserFriends(id);

    }

    @Get('/get_user_match/:id')
    async getUserMatch(@Param('id') id: string) {
        return this.userService.getUserMatch(id);
    }
}
