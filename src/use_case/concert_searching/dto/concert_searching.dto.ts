import { IsArray, isDate, IsDate, IsInt, IsOptional, IsString } from "class-validator";

// This class is used to validate the input data for the concert searching use case.

export class ConcertSearchingDto {
    @IsOptional()
    @IsArray()
    readonly performers: Array<string>;

    @IsOptional()
    @IsString()
    readonly concert_name: string;

    @IsOptional()
    @IsArray()
    readonly genres: Array<string>;

    @IsOptional()
    @IsArray()
    readonly cities: Array<string>;

    @IsOptional()
    @IsDate()
    readonly date_range_start: Date;

    @IsOptional()
    @IsDate()
    readonly date_range_end: Date;
}