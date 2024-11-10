import { Controller, Post, Body } from '@nestjs/common';
import { MessageService } from './message.service';
import { AddMessageDto } from './dto/addmessage.dto';
import { RemoveMessageDto } from './dto/removemessage.dto';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post('/addmessage')
    message(@Body() addMessageDto: AddMessageDto) {
        const {user_id, thread_id, content} = addMessageDto;
        console.log(user_id, thread_id, content);
        return this.messageService.addmessage({user_id, thread_id, content});
    }

    @Post('/removemessage')
    remove_message(@Body() removeMessageDto: RemoveMessageDto) {
        return this.messageService.removemessage(removeMessageDto);
    }
}
