import { SECONDS } from 'constants';
import { setDefaultOptions } from 'expect-puppeteer';

setDefaultOptions({ timeout: 25 * SECONDS })
class Logout {
  run(page) {
    return new Promise(async (resolve, reject) => {
      try {
<<<<<<< HEAD
        // login.run("Some Url");
        console.log("Logout triggered");
        await page.waitFor(10 * SECONDS);

        // dropdown testid  button-i3smb2jf
=======
        // Click on user dropdown (usually top right corner)
>>>>>>> bd282a3f64a6a888526126bb1f2a50642797b012
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
