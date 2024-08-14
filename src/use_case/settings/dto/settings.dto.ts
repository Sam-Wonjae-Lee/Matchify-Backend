import { IsBoolean, IsInt, IsString } from "class-validator";

export class SettingsDto {
  @IsString()
  readonly userid: string;

  @IsBoolean()
  readonly darkMode: boolean;

  @IsBoolean()
  readonly privateMode: boolean;

  @IsBoolean()
  readonly notification: boolean;
}
