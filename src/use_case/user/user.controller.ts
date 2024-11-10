import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { PostUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/get/:id')
    async getUser(@Param('id') id: string) {
        return await this.userService.getUser(id);
    }

    @Post('/post/:id')
    async updateUser(@Param('id') id: string, @Body() postUserDto: PostUserDto) {
        const {bio, location, gender, fav_playlist, dob} = postUserDto;
        return await this.userService.updateUser(id, bio, location, gender, fav_playlist, dob);
    }

    @Post('/vector/:id')
    async updateUserVector(@Param('id') id: string, @Body() vector: any) {
        return await this.userService.updateUserVector(vector.body.vector, id);
    }
  
    @Get('/get_user_friends/:id')
    async getUserFriends(@Param('id') id: string) {
        return await this.userService.getUserFriends(id);
    }

    @Post('/is_friends_with/:id')
    async getIsUserFriendsWith(@Param('id') id: string, @Body('userToCheck') userToCheck: string) {
        return await this.userService.getIsUserFriendsWith(id, userToCheck);
    }

    @Post('/unfriend/:id')
    async unfriend(@Param('id') id: string, @Body('unfriended') unfriended: string) {
        return await this.userService.unfriend(id, unfriended);

    }

}
