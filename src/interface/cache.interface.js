import config from './config';
import Api from './api';
class Cache {
  constructor() {}
  static async checkIfBaseEntityExists( baseEntity ) {
    const api = new Api();
    const data = api.call(
      `${config.databse.baseUrl}/${config.databse.getBaseEntitys}/${baseEntity}`
    );
    if ( data && data.code === baseEntity ) {
      return true;
    }
    return false;
  }
}

export default Cache;
