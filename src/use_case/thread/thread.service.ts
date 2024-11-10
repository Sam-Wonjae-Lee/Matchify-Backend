import { Injectable } from '@nestjs/common';
import { AddThreadDto } from './dto/addthread.dto';
import { RemoveThreadDto } from './dto/removeThread.dto';
import { DatabaseService } from '../../database/database.service';
import { GetMessagesDto } from './dto/getMessages.dto';
import { GetDirectThreadDto } from './dto/getDirectThread.dto';

@Injectable()
export class ThreadService { 

    constructor(private readonly databaseService: DatabaseService) {}

    // adds thread onto the database
    addthread(addThreadDto: AddThreadDto) {
        const {threadID, threadName} = addThreadDto;
        this.databaseService.add_thread(threadID, threadName);
    }

    // removes threadid from the database
    removethread(removeThreadDto: RemoveThreadDto){
        const {threadID} = removeThreadDto;
        this.databaseService.remove_thread(threadID);
    }

    // gets all messages from a thread
    getMessages(getMessagesDto: GetMessagesDto) {
        const { threadID } = getMessagesDto;
        return this.databaseService.get_messages(threadID);
    }

    // gets direct threads
    getDirectThread(getDirectThreadsDto: GetDirectThreadDto) {
        const { user1ID, user2ID } = getDirectThreadsDto;
        return this.databaseService.get_direct_thread(user1ID, user2ID);
    }
}
