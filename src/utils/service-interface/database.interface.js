import axios from 'axios';
import asyncToken from './asyncTokenUtils';



const dbService = {
  checkIfBaseEntityAttributeValueExists: async function(baseEntity,
    attributeCode,
    expectedValue,
    valueKey = 'valueString'){
      const token = await asyncToken();
      // insert the tokens

      const resp = await axios({
        method: 'GET',
        url:
          `http://bridge.genny.life:8089/read/${baseEntity}`,
      });

      const { data } = resp;

      const x = data.value.baseEntityAttributes.find(
        aa => aa.attributeCode === attributeCode
      );

      const value = x[valueKey];
      console.log({value});
      console.log({expectedValue});
      const returnData =
        value === expectedValue
          ? Promise.resolve()
          : Promise.reject(
              ` Provided value ${expectedValue} Value does not equals to value in database ${value}`
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

    deleteBaseEntityUsingCode:  async function( code ) {
      const token = await asyncToken();
      const resp = await axios({
        method: 'GET',
        url: `http://api-internmatch.outcome-hub.com/qwanda/baseentitys/${code}`,
        headers: { Authorization: `Bearer ${token.access_token}` }
      });
      console.log( resp );
    }

}

export default dbService;
