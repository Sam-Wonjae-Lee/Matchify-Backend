const clientID = '6e2ad15d4b624e38b71d65d608938d99';
const clientSecret = '8af93278ee6143bca236de33f2cd2d7c';
const redirectURI = 'http://localhost:8888/callback';

/**
 * Retrieves the access token. The access token is a string which contains the credentials and permissions that can be used to access resources.
 * The access token is valid for 1 hour. After that time, the token expires and you need to request a new one.
 * More info is located here: https://developer.spotify.com/documentation/web-api/concepts/access-token
 *
 * @return Temporary access token.
 */

// async function getAccessToken() {
//     const response = await fetch('https://accounts.spotify.com/api/token', {
//       method: 'POST',   // For creating resources
//       body: new URLSearchParams({
//         'grant_type': 'client_credentials',
//       }),
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': 'Basic ' + (Buffer.from(clientID + ':' + clientSecret).toString('base64')),
//       },
//     });
  
//     return await response.json();
// }

async function getAccessToken() {
    const clientID = 'your_client_id'; // Replace with your actual client ID
    const clientSecret = 'your_client_secret'; // Replace with your actual client secret

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',  // For creating resources
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(clientID + ':' + clientSecret).toString('base64'),
            },
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse and print the JSON response
        const data = await response.json();
        console.log('Access Token Response:', data);

        // Optionally, return the token
        return data;
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
}

// Call the function to test it
getAccessToken();