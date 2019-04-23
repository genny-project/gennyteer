import axios from 'axios';
import querystring from 'querystring';

// :String
const filterMethods = method => {
  if ( !method ) return 'GET';
  const methods = {
    get: 'GET',
    delete: 'DELETE',
    post: 'POST',
    put: 'PUT',
    patch: 'PATCH'
  };

  // convert the incoming string to lowercases
  // "GET" => "get" , "POST" => "post"

  const lowerMethod = method.toLowerCase();
  console.log( lowerMethod );

  if ( methods[lowerMethod] ) return methods[lowerMethod];
  throw Error( ' Request Method not valid' );
};

class Api {
  // :<Promise> dynamic
  static async call({
    method,
    URL,
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
        method: method || 'GET',
        url: URL,
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

// Example
// Api.call({ method: 'GET', URL: 'google.com' }).then( data => {
//   console.log( data );
// });
