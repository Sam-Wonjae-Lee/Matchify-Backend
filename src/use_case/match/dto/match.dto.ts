import { IsInt, IsString } from "class-validator";

export class MatchDto {
    @IsString()
    readonly senderID: string;

    @IsString()
    readonly receiverID: string;
}