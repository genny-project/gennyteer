import { SECONDS } from 'constants';

class Login {
  run(page) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("Login triggered");
        
        await page.goto(process.env.GENNY_URL);

        await page.waitFor(3 * SECONDS);
        await page.click('[data-testid="button"]');

        await expect(page).toFill(
          'input[type="text"]',
          process.env.AGENT_A_USERNAME
        );
        await expect(page).toFill(
          'input[type="password"]',
          process.env.AGENT_A_PASSWORD
        );
        await expect(page).toClick('div[data-testid="form-generic-submit"]');

        await page.waitFor(10000);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default Login;
