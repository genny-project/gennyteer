import { PAGE_WIDTH, PAGE_HEIGHT } from 'constants';
import Register from '../../register';
import SelectRole from '../../select-role';
import puppeteer from 'puppeteer';

class AddInternshipAgent {
  async run() {
    let browser;

    const args = ['--no-sandbox', `--window-size=${PAGE_WIDTH},${PAGE_HEIGHT}`];

    browser = await puppeteer.launch({
      args,
      headless: !process.env.HEADLESS
    });

    page = await browser.newPage();

    await page.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT
    });

    const register = new Register();
    const selectRole = new SelectRole();

    console.log('trigger reg');

    /* we register */

    await register.run(page);

    console.log('register ran');

    /* we select agent role on internmatch */
    await selectRole.run(page).then(
      () => {
        browser.close();
        return true;
      },
      error => {
        browser.close();
        return error;
      }
    );
  }
}

export default AddInternshipAgent;
