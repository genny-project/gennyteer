import axios from 'axios';
import querystring from 'querystring';

class Api {
  static async call( url, params ) {
    const stringifiedParams = querystring.stringify( params );
    try {
      const response = await axios.get( url, stringifiedParams );
      return response;
    } catch ( err ) {
      console.log( err );
      throw err;
    }
  }
}

export default Api;
