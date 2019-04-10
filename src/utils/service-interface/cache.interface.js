import axios from 'axios';

class Cache {
  async checkIfBaseEntityAttributeValueExists(
    baseEntity,
    attributeName,
    expectedValue,
    valueKey = 'valueString'
  ) {
    let resp;
    try {
      resp = await axios.get(
        `http://bridge.genny.life:8089/read/${baseEntity}`
      );
    } catch ( err ) {
      throw new Error( ' Error getting the data from Cache' );
    }

    console.log( resp.data );

    // const jsonify = JSON.parse( resp.data.value );
    const a = resp.data.value.baseEntityAttributes.find(
      el => el.attributeCode === attributeName
    );
    const value = a[valueKey];

    if ( value === expectedValue ) {
      return Promise.resolve( true );
    } else {
      return Promise.reject(
        'Expected value doesnot equals the value in the Cache'
      );
    }
  }

  async checkForBaseEntityCode( baseEntity ) {
    let resp;
    try {
      resp = await axios.get(
        `http://bridge.genny.life:8089/read/${baseEntity}`
      );
    } catch ( err ) {
      return Promise.reject(
        ' Error getting data from the cache, Cache Service could be down or baseEntityCode in not valid'
      );
    }

    const returnData =
      resp.data &&
      resp.data.value &&
      resp.data.value.baseEntityAttributes[0].baseEntityCode === baseEntity
        ? Promise.resolve( true )
        : Promise.reject();

    return returnData;
  }
}

export default Cache;
