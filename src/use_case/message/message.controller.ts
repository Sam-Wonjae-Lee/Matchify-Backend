import { Controller, Post, Body } from '@nestjs/common';
import { MessageService } from './message.service';
import { AddMessageDto } from './dto/addmessage.dto';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post('/addmessage')
    message(@Body() addMessageDto: AddMessageDto) {
        return this.messageService.addmessage(addMessageDto);
    }
}
