import axios from 'axios';
import asyncToken from './asyncTokenUtils';
import { emailSearchJSON, searchBEByAttributesAndValue } from '../constants';
import chalk from 'chalk';

console.log({ searchBEByAttributesAndValue });
class Database {
  // uses latest search baseentity
  // input => somethign@gmail.com => PER_SOMETHING_AT_GMAIL_COM
  async getBaseEntityFromEmail( email ) {
    const token = await asyncToken();
    try {
      const resp = await axios({
        method: 'POST',
        url:
          'https://api-internmatch-staging.outcome-hub.com/qwanda/baseentitys/search',
        headers: { Authorization: `Bearer ${token.access_token}` },
        data: emailSearchJSON( email )
      });
      const { data } = resp;
      return data.items[0].code;
    } catch ( err ) {
      global.log( chalk.red( err ));
    }
  }

  // uses latest search Baseentity
  async getBaseEntityByAttributeAndValue( attribute, value ) {
    const token = await asyncToken();
    try {
      const resp = await axios({
        method: 'POST',
        url:
          'https://api-internmatch-staging.outcome-hub.com/qwanda/baseentitys/search',
        headers: { Authorization: `Bearer ${token.access_token}` },
        data: searchBEByAttributesAndValue( attribute, value )
      });
      const { data } = resp;
      return data.items[0].code;
    } catch ( err ) {
      console.log( err );
      global.log( chalk.red( err ));
    }
  }

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
  // async getBaseEntityFromEmail({ email, requiresToken = true }) {
  //   const token = await asyncToken();
  //   const resp = await axios({
  //     method: 'GET',
  //     url: global.api_utils + `baseentitycode/${email}`,
  //     headers: requiresToken
  //       ? { Authorization: `Bearer ${token.access_token}` }
  //       : {}
  //   });
  //   const { data } = resp;
  //   console.log({ data });
  //   if ( data ) {
  //     return data;
  //   } else {
  //     return null;
  //   }
  // }

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
