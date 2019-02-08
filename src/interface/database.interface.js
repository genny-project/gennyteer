import Api from './api';
import config from './config';
class DatabaseInterface {
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

export default DatabaseInterface;
