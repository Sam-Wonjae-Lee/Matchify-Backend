import { Controller, Post, Body } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { AddThreadDto } from './dto/addThread.dto';
import { RemoveThreadDto } from './dto/removeThread.dto';

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
}
