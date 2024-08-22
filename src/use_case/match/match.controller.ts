import { Controller, Post, Body } from '@nestjs/common';
import { MatchDto } from './dto/match.dto';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    // // TODO: Create add users to friend function from match service
    // @Post
    // add_users_to_friend(@Body() matchDto: MatchDto) {
    //     return;
    // }

    @Post('/get_matches')
    matchPotentialFriends(@Body('user_id') user_id: string) {
        return this.matchService.matchPotentialFriends(user_id);
    }

}