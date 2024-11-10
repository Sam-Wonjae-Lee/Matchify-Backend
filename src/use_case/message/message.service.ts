import { Injectable } from '@nestjs/common';
import { AddMessageDto } from './dto/addmessage.dto';
import { RemoveMessageDto } from './dto/removemessage.dto';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class MessageService { 

    constructor(private readonly databaseService: DatabaseService) {}

    // adds message onto the database
    addmessage(addMessageDto: AddMessageDto) {
        const {user_id, thread_id, content} = addMessageDto;
        this.databaseService.add_message(user_id, thread_id, content);
    }

    // removes messageid from the database
    removemessage(removeMessageDto: RemoveMessageDto){
        const {message_id} = removeMessageDto;
        this.databaseService.remove_message(message_id);
    }

}
