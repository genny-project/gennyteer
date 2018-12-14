import { SECONDS } from 'constants';
import { setDefaultOptions } from 'expect-puppeteer';

setDefaultOptions({ timeout: 25 * SECONDS })
class Logout {
  run(page) {
    return new Promise(async (resolve, reject) => {
      try {
        // Click on user dropdown (usually top right corner)
        await page.click('[data-testid~="USER_DROPDOWN"]');
        // Click on the logout button
        await page.click('a[href="/logout"]');
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default Logout;
