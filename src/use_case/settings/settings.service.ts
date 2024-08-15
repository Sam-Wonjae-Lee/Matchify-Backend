import { Injectable } from '@nestjs/common';
import { SettingsDto } from './dto/settings.dto';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class SettingsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // create user settings
  create(settingsDto: SettingsDto) {
    const { user_id} = settingsDto;
    this.databaseService.create_userSetting (user_id);
  }

  // enable and disable options
  options(settingsDto: SettingsDto) {
    const { user_id} = settingsDto;
    this.databaseService.update_options(user_id);
  }

  // enable and disable dark mode
  dark_mode(settingsDto: SettingsDto) {
    const { user_id} = settingsDto;
    this.databaseService.update_dark_mode(user_id);
  }

  // enable and disable friend message
  friend_message(settingsDto: SettingsDto) {
    const { user_id} = settingsDto;
    this.databaseService.update_friend_message(user_id);
  }

  // enable and disable friend visibility
  friend_visibility(settingsDto: SettingsDto) {
    const { user_id} = settingsDto;
    this.databaseService.update_friend_visibility(user_id);
  }

  // enable and disable friend request
  friend_request(settingsDto: SettingsDto) {
    const { user_id} = settingsDto;
    this.databaseService.update_friend_request(user_id);
  }

  // enable and disable playlist update
  playlist_update(settingsDto: SettingsDto) {
    const { user_id} = settingsDto;
    this.databaseService.update_playlist_update(user_id);
  }

  // enable and disable new events
  new_events(settingsDto: SettingsDto) {
    const { user_id} = settingsDto;
    this.databaseService.update_new_events(user_id);
  }

  // enable and disable event reminder
  event_reminder(settingsDto: SettingsDto) {
    const { user_id} = settingsDto;
    this.databaseService.update_event_reminder(user_id);
  }
}
