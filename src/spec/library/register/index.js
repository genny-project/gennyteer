import { SECONDS } from 'constants';
import { setDefaultOptions } from 'expect-puppeteer';

// Set maximum wait time for each element to 25 seconds
setDefaultOptions({ timeout: 25 * SECONDS });

class Register {
  static run( page ) {
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
          process.env.INTERN_A_USERNAME
        );

        await expect( page ).toFill(
          'input[name="firstName"]',
          process.env.INTERN_A_FIRSTNAME
        );

        await expect( page ).toFill(
          'input[name="lastName"]',
          process.env.INTERN_A_LASTNAME
        );

        await expect( page ).toFill(
          'input[name="password"]',
          process.env.INTERN_A_PASSWORD
        );
        await expect( page ).toFill(
          'input[name="password-confirm"]',
          process.env.INTERN_A_PASSWORD
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
