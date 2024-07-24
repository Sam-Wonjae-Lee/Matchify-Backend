const clientID = '6e2ad15d4b624e38b71d65d608938d99';
const clientSecret = '8af93278ee6143bca236de33f2cd2d7c';
const redirectURI = 'http://localhost:8888/callback';

/**
 * Retrieves the access token. The access token is a string which contains the credentials and permissions that can be used to access resources.
 * The access token is valid for 1 hour. After that time, the token expires and you need to request a new one.
 * More info is located here: https://developer.spotify.com/documentation/web-api/concepts/access-token
 *
 * @return Temporary access token in JSON Format
 */

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',   // For creating resources
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(clientID + ':' + clientSecret).toString('base64')),
      },
    });
    
    const data = await response.json();
    console.log('Access Token Response:', data);

    return data;
}
