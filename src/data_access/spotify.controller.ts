import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { access } from 'fs';

@Controller('spotify')
export class SpotifyController {
  constructor(
    private readonly spotifyService: SpotifyService,
  ) {}

  // uncomment for now
  // @Get('user/:id')
  // async getUserInfo(@Param('id') id: string) {
  //   return this.spotifyService.getUserInfo(id);
  // }

  @Post('playlists/:id/tracks')
  async getPlaylistItems(@Param('id') id: string, @Body('user_id') user_id: string, @Body('limit') limit: number, @Body('offset') offset: number) {
    return this.spotifyService.getPlaylistItems(id, user_id, limit, offset);
  }

  @Get('user/:id/playlists')
  async getUserPlaylists(@Param('id') id: string) {
    console.log(id);
    return this.spotifyService.getUserPlaylists(id);
  }

  @Get('auth')
  async getAuthUrl() {
    return this.spotifyService.getAuthUrl();
  }

  // Send data to backend from frontend
  @Post('auth/callback')
  async authenticateCode(@Body('code') code: string) {
    const response = await this.spotifyService.authenticateCode(code);
    return response;
  }

  @Post('auth/create')
  async createAccount(@Body('user_id') user_id: string, @Body('username') username: string, @Body('first_name') first_name: string, @Body('last_name') last_name: string, @Body('location') location: string, @Body('dob') dob: Date, @Body('bio') bio: string, @Body('email') email: string, @Body('profile_pic') profile_pic: string, @Body('favourite_playlist') favourite_playlist: string, @Body('gender') gender: string, @Body('access_token') access_token: string, @Body('refresh_token') refresh_token: string) {
    const response = await this.spotifyService.createAccount(user_id, username, first_name, last_name, location, dob, bio, email, profile_pic, favourite_playlist, gender, access_token, refresh_token);
    return response;
  }

  @Get('user/:id/top-tracks')
  async getUserTopTracks(@Param('id') id: string) {
    return this.spotifyService.getUserTopTracks(id);
  }

  @Get('user/:id/top-artists')
  async getUserTopArtists(@Param('id') id: string) {
    return this.spotifyService.getUserTopArtists(id);
  }

  @Get('user/:id/top-genres')
  async getUserTopGenres(@Param('id') id: string) {
    return this.spotifyService.getUserTopGenres(id);
  }

  @Get('user/:id/playback')
  async getCurrentPlaybackState(@Param('id') id: string) {
    return this.spotifyService.getCurrentPlaybackState(id);
  }
}
