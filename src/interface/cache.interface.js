// import config from './config';
// import Api from './api';
import axios from 'axios';

class Cache {
  static async checkIfBaseEntityExists(
    baseEntity = 'PER_AGENT3_AT_GMAILCOM',
    attributeName = 'PRI_FIRSTNAME',
    valueKey = 'valueString',
    expectedValue = 'Agent3'
  ) {
    let resp;
    try {
      resp = await axios.get(
        `https://app3-internmatch-staging.outcome-hub.com/read/${baseEntity}`
      );
    } catch ( err ) {
      throw new Error( ' Error getting the data from Cache' );
    }

    console.log( resp.data );

    const jsonify = JSON.parse( resp.data.value );
    const a = jsonify.baseEntityAttributes.find(
      el => el.attributeCode === attributeName
    );
    const value = a[valueKey];
    console.log( a );
    console.log({ valueKey });
    console.log({ value });

    if ( value === expectedValue ) {
      return true;
    } else {
      throw new Error( ' expected value doesnot equals the value in the cache' );
    }
  }
}

export default Cache;
