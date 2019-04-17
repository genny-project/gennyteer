const axios = require('axios');
const queryString = require('querystring');


/* Get URLS */
const tokenURL = 'http://keycloak.genny.life:8180/auth/realms/genny/protocol/openid-connect/token';

/* request parameters to be sent */
const requsetParams = {
  grant_type: 'password',
  client_id: 'genny',
  username: 'service',
  password: 'OhSudsyWhatAPitty@#0&5',
  client_secret: '056b73c1-7078-411d-80ec-87d41c55c3b4'
};

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}
const getTokenUtils = async () => {
  console.debug( 'Testing for console debug ** reached get token **' );

  try {
    const response = await axios.post(
      tokenURL,
      queryString.stringify( requsetParams ),
      config
    );
    return response.data;
  } catch ( err ) {
    console.log( err );
  }
};


export default getTokenUtils;