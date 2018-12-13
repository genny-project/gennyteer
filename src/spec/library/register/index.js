import { SECONDS } from 'constants';

class Register {
  run(page) {
    return new Promise(async (resolve, reject) => {
      console.log('register triggered');
      jest.setTimeout(150 * SECONDS);

      try {
        console.log('running register');

        await page.goto(process.env.GENNY_URL);

        console.log('went to the url');
        await page.waitFor(2 * SECONDS);

        const buttons = await page.$$('[data-testid="button"]');
        const registerButton = buttons[1];
        await registerButton.click();
        await page.waitFor(2 * SECONDS);

        await expect(page).toFill(
          'input[name="email"]',
          process.env.INTERN_A_USERNAME
        );
        console.log('typed in email');

        await expect(page).toFill(
          'input[name="firstname"]',
          process.env.INTERN_A_FIRSTNAME
        );

        await expect(page).toFill(
          'input[name="lastname"]',
          process.env.INTERN_A_LASTNAME
        );

        await expect(page).toFill(
          'input[name="password"]',
          process.env.INTERN_A_PASSWORD
        );

        await page.waitFor(3 * SECONDS);
        console.log('just before submitting');

        await expect(page).toClick('[data-testid="form-generic-submit"]');

        await page.waitFor(5 * SECONDS);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default Register;
