import axios from 'axios';
import asyncToken from './asyncTokenUtils';
import delve from 'dlv';

const dbService = {

  checkIfBaseEntityAttributeValueExists: async function ( projectURL,
    baseEntity,
    attributeCode,
    expectedValue ) {
      const token = await asyncToken();
      // insert the tokens

      const resp = await axios({
        method: 'GET',
        url: `${projectURL}/qwanda/baseentitys/${baseEntity}`,
        headers: { Authorization: `Bearer ${token.access_token}` }
      });

      const x = resp.data.baseEntityAttributes.find(
        aa => aa.attributeCode === attributeCode
      );

      const value = delve( x, 'valueString' );
      const returnData =
        value === expectedValue
          ? Promise.resolve()
          : Promise.reject(
              `Provided value ${expectedValue} Value does not equals to value in database ${value}`
            );
      return returnData;
    },

    checkForBaseEntityType: async function ( projectURL,
      baseEntity,
      attributeCode,
      expectedValue ) {
        const token = await asyncToken();
        // insert the tokens

        const resp = await axios({
          method: 'GET',
          url: `${projectURL}/qwanda/baseentitys/${baseEntity}`,
          headers: { Authorization: `Bearer ${token.access_token}` }
        });

        const x = resp.data.baseEntityAttributes.find(
          aa => aa.attributeCode === attributeCode
        );

        const value = delve( x, 'valueBoolean' );
        const returnData =
          value === expectedValue
            ? Promise.resolve()
            : Promise.reject(
                `Provided value ${expectedValue} Value does not equals to value in database ${value}`
              );
        return returnData;
      },

    getBaseEntityFromEmail:  async function( email ) {
      const token = await asyncToken();
      const resp = await axios({
        method: 'GET',
        url: `http://qwanda-service.genny.life/utils/baseentitycode/${email}`,
      });
      const { data } = resp;
      console.log({ data });
      if ( data ) {
        return data;
      } else {
        return null;
      }
    },

    getBaseEntityTargetCodeFromSourceCode:  async function( projectURL, sourceCode,  linkCode ) {
      const token = await asyncToken();
      const resp = await axios({
        method: 'GET',
        url: `${projectURL}/qwanda/baseentitys/${sourceCode}/linkcodes/${linkCode}`,
        headers: { Authorization: `Bearer ${token.access_token}` }
      });
      const { data } = resp;
      if ( data ) {
        let baseEntityCode = delve( data, 'items.0.code' );
        if ( baseEntityCode == 'undefined' || baseEntityCode == null ) {
          return null;
        } else {
          return baseEntityCode;
        }
      } else {
        return null;
      }
    },

    getBaseEntityFromUniqueCode:  async function( projectURL, attributeCode,  attributeValue ) {
      const token = await asyncToken();
      const resp = await axios({
        method: 'GET',
        url: `${projectURL}/qwanda/attributeCode/${attributeCode}/attributeValue/${attributeValue}`,
        headers: { Authorization: `Bearer ${token.access_token}` }
      });
      const { data } = resp;
      if ( data ) {
        return data;
      } else {
        return null;
      }
    },

    getBaseEntityCodeFromUniqueCode:  async function( projectURL, attributeCode,  attributeValue ) {
      const token = await asyncToken();
      const resp = await axios({
        method: 'GET',
        url: `${projectURL}/qwanda/attributeCode/${attributeCode}/attributeValue/${attributeValue}`,
        headers: { Authorization: `Bearer ${token.access_token}` }
      });
      console.log( 'The access token is', token.access_token );
      const { data } = resp;
      if ( data ) {
        let baseEntityCode = delve( data, 'items.0.baseEntityAttributes.0.baseEntityCode' );
        if ( baseEntityCode == 'undefined' || baseEntityCode == null ) {
          return null;
        } else {
          return baseEntityCode;
        }
      } else {
        return null;
      }
    }
};

export default dbService;
