import { Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class SpotifyService {
  private clientID: string;
  private clientSecret: string;

  constructor() {
    this.clientID = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  }

  private async getAccessToken(): Promise<string> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',   // For creating resources
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(this.clientID + ':' + this.clientSecret).toString('base64')),
      },
    });

    if (!response.ok) {
      throw new HttpException('Failed to retrieve access token', response.status);
    }

    const data = await response.json();
    return data.access_token;
  }

  public async getUserInfo(userId: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new HttpException('Failed to retrieve user info', response.status);
    }

    return response.json();
  }
}