import axios from 'axios';
import querystring from 'querystring';

const filterMethods = method => {
  if ( !method ) return 'GET';
  const methods = {
    get: 'GET',
    delete: 'DELETE',
    post: 'POST',
    put: 'PUT',
    patch: 'PATCH'
  };
  const lowerMethod = method.toLowerCase();
  console.log( lowerMethod );

  if ( methods[lowerMethod] ) return methods[lowerMethod];
  throw Error( ' Request Method not valid' );
};
class Api {
  static async call({
    method,
    url,
    params,
    accessToken,
    stringifyData = false
  }) {
    // ** ** //
    // check if the user passed methods are valid or not
    method = filterMethods( method );

    // if user wants to stringify data then stringify otherwise sent the data without stringifying
    const stringifiedParams = stringifyData
      ? querystring.stringify( params )
      : params;

    try {
      const response = await axios({
        method,
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
