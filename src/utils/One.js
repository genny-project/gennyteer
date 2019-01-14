import puppeteer from 'puppeteer';

import { Register, Login, Logout } from '../spec/library';

const PAGE_WIDTH = 1600;
const PAGE_HEIGHT = 900;
class One {
  constructor() {
    this.page = One.generatePage();
  }

  getPage() {
    return this.page;
  }

  async beforeAllSignup() {
    const page = await this.page;
    try {
      const register = new Register();
      const result = await register.run(page);
      expect(result).toBe(true); // eslint-disable-line
    } catch (error) {
      throw new Error(error);
    }
  }

  async navigateTo(websiteURL) {
    const page = await this.page;
    await page.goto(websiteURL);
  }

  async login() {
    const page = await this.page;
    const login = new Login();
    try {
      const result = await login.run(page);
      expect(result).toBe(true); // eslint-disable-line
    } catch (error) {
      throw new Error(error);
    }
  }

  async logout() {
    const page = await this.page;
    const logout = new Logout();
    try {
      const result = await logout.run(page);
      expect(result).toBe(true); // eslint-disable-line
    } catch (error) {
      throw new Error(error);
    }
  }

  async closeBrowser() {
    const browser = await this.page.browser();
    browser.close();
  }

  /* actions */
  async click(args) {
    await expect(this.page).toClick(args); // eslint-disable-line
  }

  static async generatePage() {
    let browser = null;
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
