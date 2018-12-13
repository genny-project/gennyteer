import { SECONDS } from 'constants';

class Logout {
  run(page) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Logout triggered');
        await expect(page).toClick('[data-testid="event-button"]', {
          timeout: 30000
        });
        console.log('Click on the first role');
        await page.waitFor(20 * SECONDS);

        console.log('filling in mobile number');

        await expect(page).toFill(
          'input[data-testid~="QUE_MOBILE"]',
          process.env.INTERN_A_MOBILE
        );

        console.log('filled in mobile number');
        await page.waitFor(20 * SECONDS);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default Logout;
