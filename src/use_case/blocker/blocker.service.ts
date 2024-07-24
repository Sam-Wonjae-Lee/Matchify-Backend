import { Injectable } from '@nestjs/common';
import { BlockDto } from './dto/block.dto';
import { UnblockDto } from './dto/unblock.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BlockerService { 

    constructor(private readonly databaseService: DatabaseService) {}

    // adds blocked_user_id to user_id's blocked list
    block(blockDto: BlockDto) {
        const { user_id, blocked_user_id } = blockDto;
        this.databaseService.blockUser(user_id, blocked_user_id);
    }

    // removes unblocked_user_id from user_id's blocked list
    unblock(unblockDto: UnblockDto) {
        const { user_id, unblocked_user_id } = unblockDto;
        this.databaseService.unblockUser(user_id, unblocked_user_id);
    }

}
