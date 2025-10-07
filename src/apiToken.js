const clientId = 'acd1a7db8f824fbc9f9bc66185b587f1';
const clientSecret = 'd19852e69c09421da777af4404682760';
const authString = btoa(`${clientId}:${clientSecret}`);

fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${authString}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
})
  .then(res => res.json())
  .then(data => {
    console.log('Access Token:', data.access_token);
  });
