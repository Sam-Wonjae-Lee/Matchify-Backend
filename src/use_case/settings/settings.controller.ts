import { Controller, Post, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto } from './dto/settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly SettingsService: SettingsService) {}

  @Post('/create')
  create(@Body() SettingsDto: SettingsDto) {
    return this.SettingsService.create(SettingsDto);
  }

  @Post('/dark_mode')
  dark_mode(@Body() SettingsDto: SettingsDto) {
    return this.SettingsService.dark_mode(SettingsDto);
  }

  @Post('/private')
  private(@Body() SettingsDto: SettingsDto) {
    return this.SettingsService.private(SettingsDto);
  }

  @Post('/notification')
  notification(@Body() SettingsDto: SettingsDto) {
    return this.SettingsService.notification(SettingsDto);
  }
}
