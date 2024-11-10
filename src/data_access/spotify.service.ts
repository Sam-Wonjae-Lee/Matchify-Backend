import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { off } from 'process';
import { DatabaseService } from 'src/database/database.service';

export interface ProfileObject {
  ok: boolean,
  user_id: string,
  username: string
}

@Injectable()
export class SpotifyService implements OnApplicationBootstrap{

  private clientID: string;
  private clientSecret: string;
  private redirectURI: string;

  constructor(private readonly databaseService: DatabaseService) {
    this.clientID = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.redirectURI = process.env.SPOTIFY_REDIRECT_URI;
  }

  /** 
   * Runs on backend startup and refreshes all users tokens
   * Necessary so that users can visit other user profiles
   * */ 
  onApplicationBootstrap() {

    const refreshAllTokens = async () => {
      const rows = await this.databaseService.getAllRefreshTokens();
      for (let i = 0; i < rows.length; i++) {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST', 
          body: new URLSearchParams({
            'grant_type': 'refresh_token',
            'refresh_token': rows[i].refresh_token,
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(this.clientID + ':' + this.clientSecret).toString('base64')),
          },
        });

        if (!response.ok) {
            console.log("REFRESHING TOKEN FAILED");
            return;
        }
        const data = await response.json();
        await this.databaseService.addAccessRefreshToken(rows[i].user_id, data.access_token, data.refresh_token ? data.refresh_token : rows[i].refresh_token);
      }
      console.log("FINISHED REFRESHING ALL TOKENS ON STARTUP");
    }
    refreshAllTokens();
  }

  /**
   * Get the current user's profile. In other words, get detailed profile information about the current user.
   * More info is located here: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
   * @param accessToken
   * @returns A JSONObject containing the response data for the Spotify user.
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

  public async getAudioFeatures(trackIds: string[], userId: string): Promise<any> {
    try {

      // Prepare the track IDs as a comma-separated string
      const trackIdsString = trackIds.join(',');
      const accessToken = await this.databaseService.getUserAccessToken(userId);
      // Make the request to Spotify's Audio Features endpoint
      const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIdsString}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // Include the authorization token
        },
      });

      // Return the data from Spotify API
      return await response.json();
    } catch (error) {
      console.error('Error fetching audio features:', error);
      throw new Error('Failed to fetch audio features');
    }
  }

  public async createAccount(user_id, username, first_name, last_name, location, dob, bio, email, profile_pic, favourite_playlist, gender, access_token, refresh_token) {
    const insertionData = await this.databaseService.addUserInfo(user_id, username, first_name, last_name, location, dob, bio, email, profile_pic, favourite_playlist, gender);
    await this.databaseService.addAccessRefreshToken(user_id, access_token, refresh_token);
    return insertionData
  }

  /**
   * Retrieves the access token. The access token is a string which contains the credentials and permissions that can be used to access resources.
   * The access token is valid for 1 hour. After that time, the token expires and you need to request a new one.
   * More info is located here: https://developer.spotify.com/documentation/web-api/concepts/access-token
   * @return Temporary access token in JSON Format
   */
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
    const user = await this.databaseService.getUser(profileData.id);
    let isCreation = true;
    if (user) {
      isCreation = false;
      // if user exists we update our db with latest spotify data
      this.databaseService.updateUserInfo({user_id: profileData.id, username: profileData.display_name, email: profileData.email, profile_pic: profileData.images[1].url})
      await this.databaseService.addAccessRefreshToken(profileData.id, data.access_token, data.refresh_token);
    }
    console.log(data.access_token);
    console.log(profileData);
    return {profileData, isCreation, accessToken: data.access_token, refreshToken: data.refresh_token};
  }

  /**
   * Retrieves the URL for Spotify Authorization. The URL is used to gain access to the user's Spotify account and retrieve userID.
   * @returns URL for Spotify Authorization
   */
  public getAuthUrl(): string {
    const scope = 'user-read-private user-read-email user-top-read user-read-playback-state'; // Permissions for authorization
    const authURL = `https://accounts.spotify.com/authorize?client_id=${this.clientID}&redirect_uri=${encodeURIComponent(this.redirectURI)}&scope=${encodeURIComponent(scope)}&response_type=code`;
    return authURL;
  }

  /**
   * Get the any user's profile. Not to be confused with @see getMyUserInfo
   * More info is located here: https://developer.spotify.com/documentation/web-api/reference/get-users-profile
   * @param userId A string containing the Spotify user ID.
   * @param accessToken
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
  public async getUserPlaylists(userId: string): Promise<any> {

    console.log(userId);

    const accessToken = await this.databaseService.getUserAccessToken(userId);

    console.log(accessToken);

    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // if (!response.ok) {
    //     throw new HttpException('Failed to retrieve playlist info', response.status);
    // }
  
    const data = await response.json();
    console.log(data);
    return data;
  }

  /**
   * Get a playlist. 
   * More info is located here: https://developer.spotify.com/documentation/web-api/reference/get-playlist
   */
  public async getPlaylist(playlistId: string, userId: string) {
    const accessToken = await this.databaseService.getUserAccessToken(userId);

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  }

  /**
   * Get the tracks/items from a playlist. 
   * More info is located here: https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
   * @param playlistId A string containing the Spotify playlist ID.
   * @return A JSONObject containing the response data for playlist.
   * */
  public async getPlaylistItems(playlistId: string, userId: string, limit: number, offset: number): Promise<any> {

    const accessToken = await this.databaseService.getUserAccessToken(userId);

    // console.log(accessToken);

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    // if (!response.ok) {
    //     throw new HttpException('Failed to retrieve playlist info', response.status);
    // }
    const data = await response.json();
    return data;
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

 /**
  * Get the user's top tracks.
  * More info is located here: https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  * @param userId A string containing the Spotify user ID.
  * @return A JSONObject containing the response data for the user's top tracks.
  * */
  public async getUserTopTracks(
    userId: string, 
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'long_term',  // Set 'long_term' as default 
    limit: number = 5, 
    offset: number = 0
  ): Promise<any> {
    // Get access token associated with Spotify user id from database
    const accessToken = await this.databaseService.getUserAccessToken(userId);
    // Limit is the max number of items returned and offset determines the index of the first item returned
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error message:', errorText);
      throw new Error(`Failed to retrieve user's top tracks: ${errorText}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  }

  /**
  * Get the user's top artists.
  * More info is located here: https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  * @param userId A string containing the Spotify user ID.
  * @return A JSONObject containing the response data for the user's top artists.
  * */
  public async getUserTopArtists(
    userId: string,
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'long_term',  // Set 'long_term' as default 
    limit: number = 5,
    offset: number = 0
  ): Promise<any> {
    // Get access token associated with Spotify user id from database
    const accessToken = await this.databaseService.getUserAccessToken(userId);
    // Limit is the max number of items returned and offset determines the index of the first item returned
    const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve user's top artists`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  }

  /**
   * Count the occurrences of each genre in the user's top artists.
   * @param userId A string containing the Spotify user ID.
   * @return An object with genres as keys and their counts as values.
   */
  public async getUserTopGenres(
    userId: string,
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'long_term',  // Set 'long_term' as default 
    limit: number = 5,
    offset: number = 0
  ): Promise<{ [genre: string]: number }> {

    const data = await this.getUserTopArtists(userId, timeRange, limit, offset);
    const genreCounts: { [genre: string]: number } = {};

    data.items.forEach((artist: any) => {
      artist.genres.forEach((genre: string) => {
        if (genreCounts[genre]) {
          genreCounts[genre]++;
        } else {
          genreCounts[genre] = 1;
        }
      });
    });

    return genreCounts;
  }

  public getCurrentPlaybackState = async (userId: string) => {
    const accessToken = await this.databaseService.getUserAccessToken(userId);

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Response error message:', errorText);
      return null;
    }

    const responseBody = await response.text();

    // handles case if user is not playing music
    if (responseBody) {
      const data = JSON.parse(responseBody);
      console.log(data);
      return data.item.name;
    }
    return null;
  }


}