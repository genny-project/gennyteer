import FeStoreInterface from './festore.interface';
import DatabaseInterface from './database.interface.js';
import CacheInterface from './cache.interface';

class ServiceInterface {
  constructor() {}

  database() {
    const databaseInterface = new DatabaseInterface();
    return databaseInterface;
  }
  cache() {
    const cacheInterface = new CacheInterface();
    return cacheInterface;
  }

  //pretty much done
  feStore( store ) {
    return FeStoreInterface( store );
  }
}

export default ServiceInterface;
