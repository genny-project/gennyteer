import { SECONDS } from 'constants';

class Logout {
  run(page) {
    return new Promise(async (resolve, reject) => {
      try {
        // login.run("Some Url");
        console.log("Logout triggered");
        await page.waitFor(20 * SECONDS);

        // dropdown testid  button-i3smb2jf
        await page.click('[data-testid~="USER_DROPDOWN"]');
        // logout button test id
        await page.click('a[href="/logout"]');
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default Logout;
