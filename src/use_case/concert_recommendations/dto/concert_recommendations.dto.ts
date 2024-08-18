import { IsInt, isString } from "class-validator";
import { IsString } from "class-validator";

export class ConcertRecommendationsDto {
    @IsString()
    readonly userID: string;

    // @IsString()
    // readonly fav_artist: string;

}   