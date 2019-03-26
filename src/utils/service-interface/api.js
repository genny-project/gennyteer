import axios from 'axios';
import querystring from 'querystring';

class Api {
  static async call( url, params, accessToken ) {
    const stringifiedParams = querystring.stringify( params );
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        headers: { Authorization: `Bearer ${accessToken}` },
        data: stringifiedParams
      });
      return response;
    } catch ( err ) {
      console.log( err );
      throw err;
    }
  }
}

export default Api;
