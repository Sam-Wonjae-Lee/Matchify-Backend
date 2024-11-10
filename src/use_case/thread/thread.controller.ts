import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { AddThreadDto } from './dto/addThread.dto';
import { RemoveThreadDto } from './dto/removeThread.dto';
import { GetMessagesDto } from './dto/getMessages.dto';

@Controller('thread')
export class ThreadController {
    constructor(private readonly threadService: ThreadService) {}

    @Post('/addthread')
    thread(@Body() addThreadDto: AddThreadDto) {
        return this.threadService.addthread(addThreadDto);
    }

    @Post('/removethread')
    remove_thread(@Body() removeThreadDto: RemoveThreadDto) {
        return this.threadService.removethread(removeThreadDto);
    }

    @Get('/getmessages')
    get_messages(@Query('threadID') threadID: number) {
        return this.threadService.getMessages({ threadID });
    }

    @Get('/getdirectthread')
    get_direct_threads(@Query('user1ID') user1ID: string, @Query('user2ID') user2ID: string) {
        return this.threadService.getDirectThread({ user1ID, user2ID });
    }
}
