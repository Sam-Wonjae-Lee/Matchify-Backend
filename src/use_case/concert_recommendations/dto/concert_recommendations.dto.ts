import { IsInt, isString } from "class-validator";
import { IsString } from "class-validator";

export class ConcertRecommendationsDto {
    @IsInt()
    readonly userID: number;

    // second parameter should be the user's favourite genre (maybe in vector form)
}   