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

  // enable and disable dark mode
  dark_mode(settingsDto: SettingsDto) {
    const { user_id} = settingsDto;
    this.databaseService.update_darkMode(user_id);
  }

  // enable and disable private mode
  private(settingsDto: SettingsDto) {
    const { user_id} = settingsDto;
    this.databaseService.update_private(user_id);
  }

  // enable and disable notification
  notification(settingsDto: SettingsDto) {
    const { user_id} = settingsDto;
    this.databaseService.update_notification(user_id);
  }
}
