import { SECONDS } from 'constants';
import { setDefaultOptions } from 'expect-puppeteer';

// Set maximum wait time for each element to 25 seconds
setDefaultOptions({ timeout: 25 * SECONDS });

import faker from 'faker';

const randomName = faker.name.findName();
const randomEmail = faker.internet.email();

class Login {
  static run( page ) {
    return new Promise( async ( resolve, reject ) => {
      try {
        // Click the Log in button
        await expect( page ).toClick( '[data-testid="button"]' );

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // Fill in user email and password
        await expect( page ).toFill( '.input-email input', randomName );
        await expect( page ).toFill( 'input[type="password"]', randomEmail );

        // click the submit button
        await expect( page ).toClick( 'button[type="submit"]' );

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        resolve( true );
      } catch ( error ) {
        reject( error );
      }
    });
  }
}

export default Login;
