import { Injectable } from '@nestjs/common';
import { AddMessageDto } from './dto/addmessage.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MessageService { 

    constructor(private readonly databaseService: DatabaseService) {}

    // adds message onto the database
    addmessage(MessageDto: AddMessageDto) {
        const {messageID, userID, threadID, content} = MessageDto;
        this.databaseService.addMessage(messageID, userID, threadID, content);
    }

}
