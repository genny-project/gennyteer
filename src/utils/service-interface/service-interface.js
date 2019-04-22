import FeStoreInterface from './festore.interface';
import DatabaseInterface from './database.interface.js';
import CacheInterface from './cache.interface';

class ServiceInterface {
  constructor() {}

  database() {
    const databaseInterface = DatabaseInterface;
    return databaseInterface;
  }

  cache() {
    const cacheInterface = new CacheInterface();
    return cacheInterface;
  }

  feStore( store ) {
    return FeStoreInterface( store );
  }
}

export default ServiceInterface;
