import { Controller, Post, Body } from '@nestjs/common';
import { BlockerService } from './blocker.service';
import { BlockDto } from './dto/block.dto';
import { UnblockDto } from './dto/unblock.dto';

@Controller('blocker')
export class BlockerController {
    constructor(private readonly blockerService: BlockerService) {}

    @Post('/block')
    block(@Body() blockDto: BlockDto) {
        return this.blockerService.block(blockDto);
    }

    @Post('/unblock')
    unblock(@Body() unblockDto: UnblockDto) {
        return this.blockerService.unblock(unblockDto);
    }
}
