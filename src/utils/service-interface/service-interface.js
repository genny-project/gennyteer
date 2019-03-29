import FeStoreInterface from './festore.interface';
import FeDisplayInterface from './fedisplay.interface';
import DatabaseInterface from './database.interface';
import CacheInterface from './cache.interface';

class ServiceInterface {
  constructor() {}

  database() {
    const databaseInterface = DatabaseInterface;
    return databaseInterface;
  }

  feDisplay() {
    const feDisplay = FeDisplayInterface();
    return feDisplay;
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
