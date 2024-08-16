import { IsString, IsOptional } from "class-validator";

// This class is used to validate the input data for the concert searching use case.

export class PostUserDto {

    @IsOptional()
    @IsString()
    readonly bio: string;

    @IsOptional()
    @IsString()
    readonly location: string;

    @IsOptional()
    @IsString()
    readonly gender: string;

    @IsOptional()
    @IsString()
    readonly fav_playlist: string;

    @IsOptional()
    @IsString()
    readonly dob: string;
}