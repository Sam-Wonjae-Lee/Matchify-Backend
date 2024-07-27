import { Controller, Get, Param } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('user/:id')
  async getUserInfo(@Param('id') id: string) {
    return this.spotifyService.getUserInfo(id);
  }

  @Get('user/:id/playlists')
  async getUserPlaylist(@Param('id') id: string) {
    return this.spotifyService.getUserPlaylists(id);
  }
}
