import { SECONDS } from 'constants';
import { setDefaultOptions } from 'expect-puppeteer';

// Set maximum wait time for each element to 25 seconds
setDefaultOptions({ timeout: 25 * SECONDS });

class Logout {
  run( page ) {
    return new Promise( async ( resolve, reject ) => {
      try {
        // login.run("Some Url");
        console.log("Logout triggered");
        await page.waitFor(10 * SECONDS);

        // dropdown testid  button-i3smb2jf
        // Click on user dropdown (usually top right corner)
        await page.click('[data-testid~="USER_DROPDOWN"]');
        // Click on the logout button
        await page.click( 'a[href="/logout"]' );

        resolve( true );
      } catch ( error ) {
        reject( error );
      }
    });
  }
}

export default Logout;
