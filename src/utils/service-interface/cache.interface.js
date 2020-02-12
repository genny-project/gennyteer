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

    const x = resp.data.baseEntityAttributes.find(
      aa => aa.attributeCode === attributeCode
    );

    const value = delve( x, 'valueString' );
    const returnData =
      value === expectedValue
        ? Promise.resolve()
        : Promise.reject(
            ` Provided value ${expectedValue} Value does not equals to value in database ${value}`
          );
    return returnData;
  }
};

export default Cache;
