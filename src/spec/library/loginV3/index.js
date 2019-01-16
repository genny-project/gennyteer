import { SECONDS } from 'constants';
import { setDefaultOptions } from 'expect-puppeteer';

// Set maximum wait time for each element to 25 seconds
setDefaultOptions({ timeout: 25 * SECONDS });

class LoginV3 {
  static run( page ) {
    return new Promise( async ( resolve, reject ) => {
      try {
        // Fill in user email and password
        await expect( page ).toFill(
          'input[name="username"]',
          process.env.AGENT_A_USERNAME,
        );
        await expect( page ).toFill(
          'input[type="password"]',
          process.env.AGENT_A_PASSWORD,
        );

        // click the submit button
        await expect( page ).toClick( '[data-testid="form-generic-submit"]' );
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        resolve( true );
      } catch ( error ) {
        reject( error );
      }
    });
  }
}

export default LoginV3;