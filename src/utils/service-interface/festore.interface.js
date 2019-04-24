import deleve from 'dlv';
class FeStore {
  static baseEntityExists({ store, baseEntityCode }) {
    if ( store == null || store === 'undefined' ) {
      return false;
    } else {
      // check for baseEntitys get baseEntitys
      console.log({ store });
      const getKeysOfData = Object.keys(
        store.keycloak.vertex.baseEntities.data
      );
      const x = getKeysOfData.filter( aa => aa === baseEntityCode );

      if ( x[0] === baseEntityCode ) {
        return true;
      }
      return false;
    }
  }

  static attributeValueExists({ store, bsCode, attributeName, valueKey }) {
    const val = deleve(
      store,
      `keycloak.vertex.baseEntities.attributes.${bsCode}.${attributeName}.${
        valueKey ? valueKey : 'value'
      }`
    );
    return val;
  }
}

export default FeStore;
