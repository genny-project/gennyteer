import puppeteer from 'puppeteer';
import dateFns from 'date-fns';

const PAGE_WIDTH = 1000;
const PAGE_HEIGHT = 1000;
class One {
  constructor(headless = false, PAGE_HEIGHT = 800, PAGE_WIDTH = 800) {
    this.page = this.generatePage();
  }

  getPage() {
    return this.page;
  }

  beforeAll(func) {
    func();
  }

  afterAll(func) {
    func();
  }

  async closeBrowser() {
    const browser = await this.page.browser();
    browser.close();
  }

  describe(str) {
    const date = dateFns.format(new Date(), 'MM/DD/YYYY');
    if (!str) {
      console.log('!! Warning. Describe Method Not provided but not necessary ');
    } else {
      console.log(date, str);
    }
  }

  testCase(str) {
  }


  /* actions */
  async click(args) {
    await expect(this.page).toClick(args);
  }


  async generatePage() {
    let browser;
    const args = ['--no-sandbox', `--window-size=${PAGE_WIDTH},${PAGE_HEIGHT}`];
    browser = await puppeteer.launch({
      args,
      headless: false,
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });

    return page;
  }

  async run(cb) {
    const page = await this.page;
    cb(page);
  }
}

export default One;
