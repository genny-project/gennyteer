import { SECONDS } from 'constants';
import { setDefaultOptions } from 'expect-puppeteer';

// Set maximum wait time for each element to 25 seconds
setDefaultOptions({ timeout: 25 * SECONDS });

class Register {
  static run( page, email, firstName, lastName, password ) {
    return new Promise( async ( resolve, reject ) => {
      jest.setTimeout( 150 * SECONDS );

      try {
        // Wait for the buttons to appear
        await page.waitForSelector( '[data-testid="button"]' );

        // Grab all the buttons and click the second button (the register button)
        const buttons = await page.$$( '[data-testid="button"]' );
        const registerButton = await buttons[1];
        await registerButton.click();

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // Fill in the details for registration (email, first name, last name, password)
        await expect( page ).toFill(
          'input[name="email"]',
          email
        );

        await expect( page ).toFill(
          'input[name="firstName"]',
          firstName
        );

        await expect( page ).toFill(
          'input[name="lastName"]',
          lastName
        );

        await expect( page ).toFill(
          'input[name="password"]',
          password
        );
        await expect( page ).toFill(
          'input[name="password-confirm"]',
          password
        );

        // Click the submit button
        await expect( page ).toClick( 'button[type="submit"]' );
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        resolve( true );
      } catch ( error ) {
        reject( error );
      }
    });
  }
}

export default Register;
