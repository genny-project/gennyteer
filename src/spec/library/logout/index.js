import { SECONDS } from 'constants';
import { setDefaultOptions } from 'expect-puppeteer';

// Set maximum wait time for each element to 25 seconds
setDefaultOptions({ timeout: 300 * SECONDS });

class Logout {
  run( page ) {
    return new Promise( async ( resolve, reject ) => {
      try {

        // Click on user dropdown (usually top right corner)
        await expect(page).toClick('[data-testid~="USER_DROPDOWN"]');

        // Click on the logout button
        await expect(page).toClick( 'a[href="/logout"]' );

        resolve( true );
      } catch ( error ) {
        reject( error );
      }
    });
  }
}

export default Logout;
