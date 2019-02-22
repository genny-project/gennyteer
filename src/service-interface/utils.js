// import axios from 'axios';
// import queryString from 'querystring';
// import config from '../config';
// import * as constants from '../constants';

// /* get URLS */
// const { GET_TOKEN_URL } = constants;
// const tokenURL = GET_TOKEN_URL;

// /* request parameters to be sent */
// const requsetParams = {
//   grant_type: config.auth.grant_type,
//   client_id: config.auth.client_id,
//   username: config.auth.username,
//   password: config.auth.password,
//   client_secret: config.auth.client_secret
// };

// // get token from Genny before calling the API
// const getTokenUtils = async () => {
//   console.debug( 'Testing for console debug ** reached get token **' );
//   try {
//     const response = await axios.post(
//       tokenURL,
//       queryString.stringify( requsetParams )
//     );
//     return response.data;
//   } catch ( err ) {
//     console.log( err );
//   }
// };

// export default getTokenUtils;

// /* token now coming through */
