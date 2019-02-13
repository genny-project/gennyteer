import FeStoreInterface from './festore.interface';
import FeDisplayInterface from './fedisplay.interface';
import DatabaseInterface from './database.interface';
import CacheInterface from './cache.interface';

class Interface {
  constructor() {}

  database() {
    const databaseInterface = new DatabaseInterface();
    return databaseInterface;
  }

  feDisplay() {
    const feDisplay = new FeDisplayInterface();
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

export default Interface;
