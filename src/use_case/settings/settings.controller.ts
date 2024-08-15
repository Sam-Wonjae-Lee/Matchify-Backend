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

  @Post('/options')
  options(@Body() SettingsDto: SettingsDto) {
    return this.SettingsService.options(SettingsDto);
  }

  @Post('/dark_mode')
  dark_mode(@Body() SettingsDto: SettingsDto) {
    return this.SettingsService.dark_mode(SettingsDto);
  }

  @Post('/friend_message')
  friend_message(@Body() SettingsDto: SettingsDto) {
    return this.SettingsService.friend_message(SettingsDto);
  }

  @Post('/friend_visibility')
  friend_visibility(@Body() SettingsDto: SettingsDto) {
    return this.SettingsService.friend_visibility(SettingsDto);
  }

  @Post('/friend_request')
  friend_request(@Body() SettingsDto: SettingsDto) {
    return this.SettingsService.friend_request(SettingsDto);
  }

  @Post('/playlist_update')
  playlist_update(@Body() SettingsDto: SettingsDto) {
    return this.SettingsService.playlist_update(SettingsDto);
  }

  @Post('/new_events')
  new_events(@Body() SettingsDto: SettingsDto) {
    return this.SettingsService.new_events(SettingsDto);
  }

  @Post('/event_reminder')
  event_reminder(@Body() SettingsDto: SettingsDto) {
    return this.SettingsService.event_reminder(SettingsDto);
  }
}
