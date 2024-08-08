import { Injectable } from '@nestjs/common';
import { AddThreadDto } from './dto/addthread.dto';
import { RemoveThreadDto } from './dto/removeThread.dto';
import { DatabaseService } from '../../database/database.service';

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

}
