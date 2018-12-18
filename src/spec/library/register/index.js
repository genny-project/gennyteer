import { SECONDS } from 'constants';

class Register {
  run( page ) {
    return new Promise( async ( resolve, reject ) => {
      jest.setTimeout( 150 * SECONDS );

      try {
        // Go to project URL
        await page.goto( process.env.GENNY_URL );
        await page.waitFor( 2 * SECONDS );

        // Grab all the buttons and click the second button (the register button)
        const buttons = await page.$$( '[data-testid="button"]' );
        const registerButton = buttons[1];
        await registerButton.click();
        await page.waitFor( 2 * SECONDS );

        // Fill in the details for registration (email, first name, last name, password)
        await expect( page ).toFill(
          'input[name="email"]',
          process.env.INTERN_A_USERNAME
        );

        await expect( page ).toFill(
          'input[name="firstname"]',
          process.env.INTERN_A_FIRSTNAME
        );

        await expect( page ).toFill(
          'input[name="lastname"]',
          process.env.INTERN_A_LASTNAME
        );

        await expect( page ).toFill(
          'input[name="password"]',
          process.env.INTERN_A_PASSWORD
        );

        // Click the submit button 
        await expect( page ).toClick( '[data-testid="form-generic-submit"]' );

        resolve( true );
      } catch ( error ) {
        reject( error );
      }
    });
  }
}

export default Register;
