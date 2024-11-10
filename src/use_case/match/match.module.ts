import { Module } from '@nestjs/common';
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [MatchController],
    providers: [MatchService],
})

export class MatchModule {}