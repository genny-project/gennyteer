import storeJSON from './storeTest.json';
class FeStore {
  constructor( store = storeJSON ) {
    this.store = store;
  }
  static async baseEntityExists( baseEntityParams ) {
    if (
      this.store === null ||
      this.store == null ||
      this.store === 'undefined'
    ) {
      return false;
    } else {
      // check for baseEntitys get baseEntitys
      const getKeysOfData = Object.keys(
        storeJSON.keycloak.vertex.baseEntities.data
      );
      const baseEntityExists = getKeysOfData.forEach( baseEntity => {
        if ( baseEntity === baseEntityParams ) {
          return true;
        }
      });
      return baseEntityExists;
    }
  }

  // TOIMPLEMENT
  // static async questionExists() {}
  // static async attributeExists() {}
  // static async baseEntityIsLinkedToAnotherBaseEntiyAsSource() {}
  // static async baseEntityIsLinkedToAnotherBaseEntiyAsTarger() {}
  // static async questionIsLinkedToAnotherQuestion() {}
  // static async attributeIsLinkedToQuestion() {}
  // static async attributeIsLinkedToBaseEntity() {}
}

export default FeStore;
