import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../database/database.service";
import { MatchDto } from "./dto/match.dto";

@Injectable()
export class MatchService {
    constructor(private readonly databaseService: DatabaseService) {}

    // match_users(matchDto: MatchDto) {
    //     const {senderID, receiverID} = matchDto;
    //     // TODO: Create add users to friend function in database.service
    //     // this.databaseService
    // }

    matchPotentialFriends(user_id: string) {
        return this.incrediblyComplexMatchingAlgorithm(user_id);

    }

    private incrediblyComplexMatchingAlgorithm(user_id) {
        return this.databaseService.getUnfriendedUsers(5, user_id);
    }
}