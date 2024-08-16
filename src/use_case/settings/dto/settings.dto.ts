import { IsString, IsBoolean } from 'class-validator';

export class SettingsDto {
  @IsString()
  readonly user_id: string;

  @IsBoolean()
  readonly options: boolean;
  
  @IsBoolean()
  readonly dark_mode: boolean;

  @IsBoolean()
  readonly friend_message: boolean;

  @IsBoolean()
  readonly friend_visibility: boolean;

  @IsBoolean()
  readonly friend_request: boolean;

  @IsBoolean()
  readonly playlist_update: boolean;

  @IsBoolean()
  readonly new_events: boolean;

  @IsBoolean()
  readonly event_reminder: boolean;
}
