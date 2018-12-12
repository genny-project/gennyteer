import { PAGE_WIDTH, PAGE_HEIGHT } from 'constants';

class Login {
  run(page) {
    return new Promise(async (resolve, reject) => {
      try {

        await page.goto(process.env.GENNY_URL);

        await page.waitFor(3000);
        await page.click('[data-testid="button"]');

        await expect(page).toFill(
          '[data-testid="form-generic-input"] input[type="text"]',
          process.env.AGENT_A_USERNAME
        );
        await expect(page).toFill(
          '[data-testid="form-generic-input"] input[type="password"]',
          process.env.AGENT_A_PASSWORD
        );
        await expect(page).toClick('div[data-testid="form-generic-submit"');

        await page.waitFor(10000);
        await expect(page).toClick('div[data-testid="event-button"]');
        resolve(true);
      } 
      catch (error) {
        reject(error);
      }
    });
  }
}

export default Login;
