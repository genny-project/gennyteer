import axios from 'axios';
import queryString from 'querystring';
/* Get URLS */
const GET_TOKEN_URL = 'https://keycloak.gada.io/auth/realms/internmatch/protocol/openid-connect/token';
const tokenURL = GET_TOKEN_URL;
/* request parameters to be sent */
const requsetParams = {
  grant_type: 'password',
  client_id: 'alyson',
  username: 'user1@gmail.com',
  password: 'rY2bbG7PeB09RXwPg',
};
const getTokenUtils = async () => {
  // console.debug( 'Testing for console debug ** reached get token **' );
  try {
    const response = await axios.post(
      tokenURL,
      queryString.stringify( requsetParams )
    );
    // console.log( 'The response is:: ', response.data );
    return response.data;
  } catch ( err ) {
    console.log( err );
  }
};
export default getTokenUtils;