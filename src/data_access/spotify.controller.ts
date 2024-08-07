import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('user/:id')
  async getUserInfo(@Param('id') id: string) {
    return this.spotifyService.getUserInfo(id);
  }

  @Get('user/:id/playlists')
  async getUserPlaylists(@Param('id') id: string) {
    return this.spotifyService.getUserPlaylists(id);
  }

  @Get('auth')
  async getTesting() {
    return this.spotifyService.getAuthUrl();
  }

  @Post('auth/callback')
  async authenticateCode(@Body('code') code: string) {
    return this.spotifyService.authenticateCode(code);
  }
}
