import Api from './api';
import config from './config';
class DatabaseInterface {
  async getBaseEntityData( baseEntity ) {
    const api = new Api();
    const data = api.call(
      `${config.databse.baseUrl}/${config.databse.getBaseEntitys}/${baseEntity}`
    );
    if ( data && data.code === baseEntity ) {
      return data;
    }
    return null;
  }

  static async checkIfBaseEntityExists( baseEntityParams ) {
    const baseEntity = await this.getBaseEntityData();
    if ( baseEntity && baseEntity.code == baseEntityParams ) {
      return true;
    }
    return false;
  }

  static async checkIfBaseEntityAttributeValueEquals(
    baseEntityParams,
    attributeCode,
    value
  ) {}
}

export default DatabaseInterface;
