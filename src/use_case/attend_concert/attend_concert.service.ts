import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../database/database.service";
import { AttendConcertDto } from "./dto/attend_concert.dto";

@Injectable()
export class AttendConcertService {
    constructor(private readonly databaseService: DatabaseService) {}

    attend_concert(attendConcertDto: AttendConcertDto) {
        const {userID, concertID} = attendConcertDto;
        this.databaseService.add_user_to_concert(userID, concertID);
    }

    unattend_concert(attendConcertDto: AttendConcertDto) {
        const {userID, concertID} = attendConcertDto;
        this.databaseService.remove_user_from_concert(userID, concertID);
    }

    is_user_attending_concert(userID: number, concertID: string) {
        return this.databaseService.is_user_attending_concert(userID, concertID);
    }
}