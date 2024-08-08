import { Injectable } from '@nestjs/common';
import { AddMessageDto } from './dto/addmessage.dto';
import { RemoveMessageDto } from './dto/removemessage.dto';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class MessageService { 

    constructor(private readonly databaseService: DatabaseService) {}

    // adds message onto the database
    addmessage(addMessageDto: AddMessageDto) {
        const {messageID, userID, threadID, content} = addMessageDto;
        this.databaseService.add_message(messageID, userID, threadID, content);
    }

    // removes messageid from the database
    removemessage(removeMessageDto: RemoveMessageDto){
        const {messageID} = removeMessageDto;
        this.databaseService.remove_message(messageID);
    }

}
