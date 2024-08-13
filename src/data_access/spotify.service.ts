import { Injectable, HttpException, Redirect } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

export interface ProfileObject {
  ok: boolean,
  user_id: string,
  username: string
}

@Injectable()
export class SpotifyService {

  private clientID: string;
  private clientSecret: string;
  private redirectURI: string;

  constructor(private readonly databaseService: DatabaseService) {
    this.clientID = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.redirectURI = process.env.SPOTIFY_REDIRECT_URI;
  }

  /**
   * Retrieves the access token. The access token is a string which contains the credentials and permissions that can be used to access resources.
   * The access token is valid for 1 hour. After that time, the token expires and you need to request a new one.
   * More info is located here: https://developer.spotify.com/documentation/web-api/concepts/access-token
   * @return Temporary access token in JSON Format
   */

  public async getMyUserInfo(accessToken: string): Promise<any> {

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // if (!response.ok) {
    //   throw new HttpException('Failed to retrieve user info', response.status);
    // }

    const data = await response.json();
    return data;
  }


  public async authenticateCode(code: string) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',   // For creating resources
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': this.redirectURI,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(this.clientID + ':' + this.clientSecret).toString('base64')),
      },
    });

    // if (!response.ok) {
    //   throw new HttpException('Failed to retrieve access token', response.status);
    // }


    const data = await response.json();
    const profileData = await this.getMyUserInfo(data.access_token);
    const db_response = await this.databaseService.addAccessRefreshToken(profileData.id, data.access_token, data.refresh_token);
    console.log(db_response);
    console.log("Access Token: " + data.access_token);
    console.log(profileData);
    return profileData;
  }

  /**
   * Retrieves the URL for Spotify Authorization. The URL is used to gain access to the user's Spotify account and retrieve userID.
   * @returns URL for Spotify Authorization
   */
  public getAuthUrl(): string {
    const scope = 'user-read-private user-read-email'; // Permissions for authorization
    const authURL = `https://accounts.spotify.com/authorize?client_id=${this.clientID}&redirect_uri=${encodeURIComponent(this.redirectURI)}&scope=${encodeURIComponent(scope)}&response_type=code`;
    return authURL;
  }

  /**
   * Get the user's profile. In other words, get detailed profile information about the user.
   * More info is located here: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
   * @param userId A string containing the Spotify user ID.
   * @returns A JSONObject containing the response data for the Spotify user.
   */
  public async getUserInfo(userId: string, accessToken: string): Promise<any> {

    const response = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // if (!response.ok) {
    //   throw new HttpException('Failed to retrieve user info', response.status);
    // }

    return response.json();
  }

  /**
   * Get the user's playlist information. This consists information from the playlist like images, playlist id, etc.
   * More info is located here: https://developer.spotify.com/documentation/web-api/reference/get-list-users-playlists
   * @param userId A string containing the Spotify user ID.
   * @return A JSONObject containing the response data for the user's playlist.
   * */
  public async getUserPlaylists(userId: string, accessToken: string): Promise<any> {

    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // if (!response.ok) {
    //     throw new HttpException('Failed to retrieve playlist info', response.status);
    // }
  
    return response.json();
  }

  /**
   * Get the tracks/items from a playlist. 
   * More info is located here: https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
   * @param userId A string containing the Spotify playlist ID.
   * @return A JSONObject containing the response data for playlist.
   * */
  public async getPlaylistItems(playlistId: string, accessToken: string): Promise<any> {

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    // if (!response.ok) {
    //     throw new HttpException('Failed to retrieve playlist info', response.status);
    // }

    return response.json();
  }

  /**
   * Get the attributes values from a song. This consists information like acousticness, danceability, energy, etc.
   * More info is located here: https://developer.spotify.com/documentation/web-api/reference/get-audio-features
   * @param userId A string containing the Spotify song ID.
   * @return A JSONObject containing the response data for song attributes.
   * */
  public async getTrackAudioFeatures(trackId: string, accessToken: string): Promise<any> {

    const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    // if (!response.ok) {
    //     throw new HttpException('Failed to retrieve playlist info', response.status);
    // }

    return response.json();
  }

  
}