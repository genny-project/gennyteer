import axios from 'axios';
import queryString from 'querystring';
import config from '../config';

/* get URLS */
const GET_TOKEN_URL =
  'https://bouncer.outcome-hub.com/auth/realms/internmatch/protocol/openid-connect/token';
const tokenURL = GET_TOKEN_URL;

/* request parameters to be sent */
const requsetParams = {
  grant_type: 'password',
  client_id: config.client_id,
  username: config.username,
  password: config.password,
  client_secret: config.client_secret
};

// get token from Genny before calling the API
const getTokenUtils = async () => {
  console.debug( 'Testing for console debug ** reached get token **' );
  try {
    const response = await axios.post(
      tokenURL,
      queryString.stringify( requsetParams )
    );
    return response.data;
  } catch ( err ) {
    console.log( err );
  }
};

export default getTokenUtils;

/* token now coming through */
