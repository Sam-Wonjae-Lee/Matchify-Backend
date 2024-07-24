import { Controller, Post, Body } from '@nestjs/common';
import { MessageService } from './message.service';
import { AddMessageDto } from './dto/addmessage.dto';
import { RemoveMessageDto } from './dto/removemessage.dto';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post('/addmessage')
    message(@Body() addMessageDto: AddMessageDto) {
        return this.messageService.addmessage(addMessageDto);
    }

    @Post('/removemessage')
    remove_message(@Body() removeMessageDto: RemoveMessageDto) {
        return this.messageService.removemessage(removeMessageDto);
    }
}
