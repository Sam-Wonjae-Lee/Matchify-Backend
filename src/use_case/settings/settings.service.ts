import { Injectable } from '@nestjs/common';
import { SettingsDto } from './dto/settings.dto';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class SettingsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // create user settings
  create(settingsDto: SettingsDto) {
    const { userid} = settingsDto;
    this.databaseService.create_userSetting (userid);
  }

  // enable and disable dark mode
  dark_mode(settingsDto: SettingsDto) {
    const { userid} = settingsDto;
    this.databaseService.update_darkMode(userid);
  }

  // enable and disable private mode
  private(settingsDto: SettingsDto) {
    const { userid} = settingsDto;
    this.databaseService.update_private(userid);
  }

  // enable and disable notification
  notification(settingsDto: SettingsDto) {
    const { userid} = settingsDto;
    this.databaseService.update_notification(userid);
  }
}
