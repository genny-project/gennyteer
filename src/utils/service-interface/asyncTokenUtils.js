import axios from 'axios';
import queryString from 'querystring';

/* Get URLS */
const GET_TOKEN_URL = 'https://keycloak.gada.io/auth/realms/internmatch/protocol/openid-connect/token';

const tokenURL = GET_TOKEN_URL;

/* request parameters to be sent */
const requsetParams = {
  grant_type: 'password',
  client_id: 'internmatch',
  username: 'user1',
  password: 'WelcomeToTheHub121!',
  client_secret: 'dc7d0960-2e1d-4a78-9eef-77678066dbd3'
};

const getTokenUtils = async () => {
  // console.debug( 'Testing for console debug ** reached get token **' );
  try {
    const response = await axios.post(
      tokenURL,
      queryString.stringify( requsetParams )
    );
    // console.log( response.data );
    return response.data;
  } catch ( err ) {
    console.log( err );
  }
};

export default getTokenUtils;
