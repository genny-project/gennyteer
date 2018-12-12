import { PAGE_WIDTH, PAGE_HEIGHT, TEST_TIMEOUT, JOB_ID } from 'constants';

class Register {
  run(page) {
    return new Promise(async (resolve, reject) => {
      jest.setTimeout(150000);

      try {
        console.log('running register');

        

        await page.goto(process.env.GENNY_URL);

        console.log('went to the url');
        await page.waitFor(2 * 1000);

        const buttons = await page.$$('[data-testid="button"]');
        const registerButton = buttons[1];
        await registerButton.click();
        await page.waitFor(2 * 1000);

        await expect(page).toFill(
          'input[name="email"]',
          process.env.INTERN_A_USERNAME
        );
        await page.waitFor(3 * 1000);
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

        await page.waitFor(3 * 1000);
        console.log('just before submitting');

        await expect(page).toClick('[data-testid="form-generic-submit"]');

        await expect(page).toClick('[data-testid="event-button"]', {
          timeout: 30000
        });
        await page.waitFor(5 * 1000);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default Register;
