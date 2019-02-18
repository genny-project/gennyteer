// import config from './config';
// import Api from './api';
import axios from 'axios';
class Cache {
  static async checkIfBaseEntityExists() {
    const resp = await axios.get(
      'https://app3-internmatch-staging.outcome-hub.com/read/PRJ_INTERNMATCH'
    );

    // console.log( resp.data.value );
    const jsonify = JSON.parse( resp.data.value );
    console.log( jsonify );

    return resp;
  }
}

export default Cache;
