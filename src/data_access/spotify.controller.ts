import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  // uncomment for now
  // @Get('user/:id')
  // async getUserInfo(@Param('id') id: string) {
  //   return this.spotifyService.getUserInfo(id);
  // }

  // @Get('user/:id/playlists')
  // async getUserPlaylists(@Param('id') id: string) {
  //   return this.spotifyService.getUserPlaylists(id);
  // }

  @Get('auth')
  async getAuthUrl() {
    return this.spotifyService.getAuthUrl();
  }

  @Post('auth/callback')
  async authenticateCode(@Body('code') code: string) {
    const response = await this.spotifyService.authenticateCode(code);
    console.log("PAOKWDPOKWDAOWPD");
    return response;
  }
}
