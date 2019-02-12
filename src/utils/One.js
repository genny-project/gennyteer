import puppeteer from 'puppeteer';

import { Register, Login, Logout } from '../spec/library';

const PAGE_WIDTH = 1600;
const PAGE_HEIGHT = 900;
class One {
  async getPage() {
    const page = await One.generatePage();
    return page;
  }

  async beforeAllSignup() {
    const page = await One.generatePage();
    try {
      const register = new Register();
      const result = await register.run( page );
      expect( result ).toBe( true );
    } catch ( error ) {
      throw new Error( error );
    }
  }

  async navigateTo( websiteURL ) {
    const page = await One.generatePage();
    await page.goto( websiteURL );
  }

  // async login() {
  //   const page = await One.generatePage();
  //   try {
  //     const result = await Login.run( page );
  //     expect( result ).toBe( true );
  //   } catch ( error ) {
  //     throw new Error( error );
  //   }
  // }

  // async logout() {
  //   const page = await One.generatePage();
  //   try {
  //     const result = await Logout.run( page );
  //     expect( result ).toBe( true );
  //   } catch ( error ) {
  //     throw new Error( error );
  //   }
  // }

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

  async run( cb ) {
    const page = await One.generatePage();
    cb( page );
  }
}

export default One;
