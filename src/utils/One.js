import puppeteer from 'puppeteer';

const PAGE_WIDTH = 1600;
const PAGE_HEIGHT = 900;
class One {
  async getPage() {
    const page = await One.generatePage();
    return page;
  }

  async navigateTo( websiteURL ) {
    const page = await One.generatePage();
    await page.goto( websiteURL );
  }

  async closeBrowser() {
    const page = await One.generatePage();
    const browser = await page.browser();
    await browser.close();
  }

  /* actions */
  async click( args ) {
    await expect( One.generatePage()).toClick( args );
  }

  static async generatePage() {
    let browser = null;
    const args = ['--no-sandbox', `--window-size=${PAGE_WIDTH},${PAGE_HEIGHT}`];
    browser = await puppeteer.launch({
      args,
      headless: false
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT
    });

    return page;
  }
}

export default One;
