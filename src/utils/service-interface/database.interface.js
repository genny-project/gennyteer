import axios from 'axios';
import asyncToken from './asyncTokenUtils';
class Database {
  async checkIfBaseEntityAttributeValueExists({
    baseEntity,
    attributeCode,
    expectedValue,
    valueKey = 'valueString',
    requiresToken = true
  }) {
    const token = await asyncToken();

    const resp = await axios({
      method: 'GET',
      url: `http://bridge.genny.life:8089/read/${baseEntity}`,
      headers: requiresToken
        ? { Authorization: `Bearer ${token.access_token}` }
        : {}
    });

    const { data } = resp;

    const x = data.value.baseEntityAttributes.find(
      aa => aa.attributeCode === attributeCode
    );

    const value = x[valueKey];
    const returnData =
      value === expectedValue
        ? Promise.resolve()
        : Promise.reject(
            ` Provided value ${expectedValue} Value does not equals to value in database ${value}`
          );
    return returnData;
  }

  // this is now working
  async getBaseEntityFromEmail({ email, requiresToken = true }) {
    const token = await asyncToken();
    const resp = await axios({
      method: 'GET',
      url: `http://api-internmatch-staging.outcome-hub.com/utils/baseentitycode/${email}`,
      headers: requiresToken
        ? { Authorization: `Bearer ${token.access_token}` }
        : {}
    });
    const { data } = resp;
    console.log({ data });
    if ( data ) {
      return data;
    } else {
      return null;
    }
  }

  async getBaseEntityFromUniqueCode( uniquecode, requiresToken = true ) {
    const token = await asyncToken();
    const resp = await axios({
      method: 'GET',
      url: `http://qwanda-service.genny.life/qwanda/companycode/${uniquecode}`,
      headers: requiresToken
        ? { Authorization: `Bearer ${token.access_token}` }
        : {}
    });
    const { data } = resp;
    if ( data ) {
      return data;
    } else {
      return null;
    }
  }

  async deleteBaseEntityUsingCode( code, requiresToken = true ) {
    const token = await asyncToken();
    const resp = await axios({
      method: 'GET',
      url: `http://api-internmatch.outcome-hub.com/qwanda/baseentitys/${code}`,
      headers: requiresToken
        ? { Authorization: `Bearer ${token.access_token}` }
        : {}
    });
    console.log( resp );
  }

  async getBaseEntityFromLinkCodeBaseEntity(
    baseEntity,
    linkCode,
    requiresToken = true
  ) {
    const token = await asyncToken();
    const resp = await axios({
      method: 'GET',
      url: `http://qwanda-service.genny.life/qwanda/baseentitys/${baseEntity}/linkcodes/${linkCode}`,
      headers: requiresToken
        ? { Authorization: `Bearer ${token.access_token}` }
        : {}
    });
    const { data } = resp;
    console.log({ data });
    if ( data ) {
      return data;
    } else {
      return null;
    }
  }
}

export default Database;
