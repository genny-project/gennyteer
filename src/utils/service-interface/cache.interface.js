import axios from 'axios';
import asyncToken from './asyncTokenUtils';
import delve from 'dlv';

const Cache =  {
  checkIfBaseEntityAttributeValueExists: async function ( projectURL,
    baseEntity,
    attributeCode,
    expectedValue ) {
    const token = await asyncToken();

    const resp = await axios({
      method: 'GET',
      url: `${projectURL}service/cache/read/${baseEntity}`,
      headers: { Authorization: `Bearer ${token.access_token}` }
    });

    const { data } = resp;
    console.log( 'STARTING RESPONSE JSON #### ', resp );
    console.log( 'ENDING RESPONSE JSON #### ' );
    const x = data[1].value.baseEntityAttributes.find(
      aa => aa.attributeCode === attributeCode
    );

    const valueFromResp = delve( x, 'valueString' );
    const returnData =
    valueFromResp === expectedValue
        ? Promise.resolve()
        : Promise.reject(
            ` Provided value ${expectedValue} Value does not equals to value in database ${valueFromResp}`
          );
    return returnData;
  }
};

export default Cache;
