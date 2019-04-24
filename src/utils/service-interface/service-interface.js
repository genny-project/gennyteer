import FeStoreInterface from './festore.interface';
import DatabaseInterface from './database.interface.js';
import CacheInterface from './cache.interface';

class ServiceInterface {
  constructor() {}

  database() {
    const db = new DatabaseInterface();
    return db;
  }

  cache() {
    const cache = new CacheInterface();
    return cache;
  }

  feStore( store ) {
    return FeStoreInterface( store );
  }
}

// export default ServiceInterface
export default ServiceInterface;
