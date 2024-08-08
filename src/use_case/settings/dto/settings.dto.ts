import { IsBoolean, IsInt } from "class-validator";

export class SettingsDto {
  @IsInt()
  readonly user_id: number;

  @IsBoolean()
  readonly darkMode: boolean;

  @IsBoolean()
  readonly privateMode: boolean;

  @IsBoolean()
  readonly notification: boolean;
}
