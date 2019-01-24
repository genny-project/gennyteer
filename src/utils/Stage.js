import puppeteer from 'puppeteer';

import { Register, Login, Logout, LoginV3 } from '../spec/library';
import Actor from './Actor';

const PAGE_WIDTH = 1600;
const PAGE_HEIGHT = 900;
class Stage {
  constructor() {
    this.page = Stage.generatePage();
    this.generateActor();
  }

  async generateActor(){
    this.actor = await new Actor( this.page );
  }

  async getActor(){
    return this.actor;
  }

  getPage() {
    return this.page;
  }

  async signUpOnKeycloak( userInfo ) {
    const page = await this.page;
    try {
      await Register.run(
        page,
        userInfo.email,
        userInfo.firstName,
        userInfo.lastName,
        userInfo.password
      );
    } catch ( error ) {
      console.log( error );
    }
  }

  async navigateTo( websiteURL ) {
    const page = await this.page;
    await Promise.all( [
      page.goto( websiteURL ),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    ] );
    // await page.waitFor( 5000 );
  }

  async login( userInfo ) {
    const page = await this.page;
    try {
      const result = await Login.run( page , userInfo.email, userInfo.password );
      expect( result ).toBe( true );
    } catch ( error ) {
      throw new Error( error );
    }
  }

  async loginV3() {
    const page = await this.page;
    try {
      const result = await LoginV3.run( page );
      expect( result ).toBe( true );
    } catch ( error ) {
      throw new Error( error );
    }
  }

  async logout() {
    const page = await this.page;
    try {
      const result = await Logout.run( page );
      expect( result ).toBe( true );
    } catch ( error ) {
      throw new Error( error );
    }
  }

  async closeBrowser() {
    const page = await this.page;
    const browser = await page.browser();
    await browser.close();
  }

  /* actions */
  async click( args ) {
    await expect( this.page ).toClick( args );
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
    const page = await this.page;
    cb( page );
  }
}

export default Stage;
