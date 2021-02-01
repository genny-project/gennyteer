import puppeteer from 'puppeteer';
import { SECONDS } from 'constants';
import faker from 'faker';
import ScSchot from './Screenshot';
import Services from './service-interface';
const PAGE_WIDTH = 1920;
const PAGE_HEIGHT = 1380;

class GennyDesktopBrowser {
  constructor( page ) {
    this.page = page;
  }

  static async build( gennyURL ) {
    // Builder function for initiating new instance of GennyDesktopBrowser
    const page = await GennyDesktopBrowser.generatePage();
    const newDesktopBrowser = await new GennyDesktopBrowser( page );
    await newDesktopBrowser.navigateTo( gennyURL );
    return newDesktopBrowser;
  }

  faker() {
    return faker;
  }

  // Get the store from frontend
  async getStore() {
    await this.page.evaluate(() => {
      console.log( window.store.getState());
      if ( window && window.store ) return window.store.getState();
      throw new Error(
        'Store object does not exists on the window in pupptter please check Alyson v3 is updated to use the store Object'
      );
    });
  }

  // Get the page instance
  getPage() {
    return this.page;
  }

  // Sleep
  async sleep( duration ) {
    const SECONDS = 1000;
    await this.page.waitFor( duration * SECONDS );
  }

  //Refresh page
  async refresh() {
   //await this.page.reload({ timeout: 60000 ,  waitUntil: ["networkidle0", "domcontentloaded"] });
    await this.page.reload({ timeout: 90000 });
  }

  async navigateTo( websiteURL ) {
    const page = await this.page;
    await Promise.all( [
      page.goto( websiteURL ),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    ] );
  }

  //goback to previous page

  async back(){
    const page=await this.page;
    await page.goBack();
  }

  //close the browser alltogether
  async closeBrowser() {
    const browser = await this.page.browser();
    await browser.close();
  }

  static async generatePage() {
    let browser = null;
    const slowMo = process.env.SLOW_MO ?  process.env.SLOW_MO  : null;
    const args = ['--no-sandbox', `--window-size=${PAGE_WIDTH},${PAGE_HEIGHT}`];
    browser = await puppeteer.launch({
      args,
      headless:false,
      slowMo:slowMo
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT
    });

    return page;
  }

  //Screenshot this has not been tested yet
  async screenshot( fileName,screenshot_path ) {
    console.log( screenshot_path );
    const scShot = new ScSchot( this.page, fileName );
    scShot.shoot( screenshot_path );
  }

  async clickOnSelector( selector ) {
    await this.page.waitForSelector( selector );
    await expect( this.page ).toClick( selector );
  }

  async inputTextBoxUsingCSS( selector, text, options = {}) {
    await this.page.waitForSelector( selector, options );
    // Type into an input field on the page
    await expect( this.page ).toFill( selector, text );
  }

  async inputTextUsingID( id, text ) {
    const selector = `#${id}`;
    await this.page.waitForSelector( selector );
    await this.inputTextBoxUsingCSS( selector, text );
  }

  async inputTextUsingTestID( id,text ) {
    const selector=`[test-id="${id}"]`;
    await this.page.click( selector );
    await this.page.keyboard.type( text );
  }

  async typeInput( askId, text ) {
    let selector = `[test-id="${askId}"]`;
    await this.page.waitForSelector( selector );

    // Type into an input field on the page
    await expect( this.page ).toFill( selector, text );
  }

  async typeInputText( askId, text ) {
    // Type into an text input on the page
    await this.typeInput( askId, text );
  }

  async typeInputAutocomplete( askId, text, selectorId ) {
    const selector = `[test-id="${askId}"]`;

    // Type into the autocmplete input
    await this.typeInputText( askId, text );
    await this.page.waitFor( 5 * SECONDS );

    // Wait for the element to load before continuing
    await this.page.waitForSelector( selector );

    // Click on the first autocomplete result
    const selectorItem = `[test-id="${selectorId}"]`;
    await expect( this.page ).toClick( selectorItem );
  }

  // async selectTag
  // ( askId, options = {}) {
  //   const { clickIndex = 0 } = options;
  //   const optionSelector = `[data-testid="input-tag-option ${askId}"]`;
  //   const regexOptionSelector = optionSelector.match( /data-testid="input-tag-option.*$/g );
  //   const arrayValueOptionSelector = `[${regexOptionSelector[0]}`;

  //   await this.page.waitFor( 5 * SECONDS );

  //   // Click the tags dropdown
  //   await this.click( `input-text input-tag ${askId}` );

  //   // Clicking tags option
  //   await this.page.waitForSelector( optionSelector );
  //   const tagSelection = await this.page.$$( arrayValueOptionSelector );
  //   const specificSelection = await tagSelection[clickIndex];
  //   await specificSelection.click();
  // }

  

  async selectSpecificTag
  ( askId, baseentityCode ) {
    const optionSelector = `[test-id="${baseentityCode}"]`;

    // There are no events or elements to wait for to make sure the tags are ready.
    // TODO: Make it happen
    await this.page.waitFor( 5 * SECONDS );

    // Click the tags dropdown
    await this.page.click( `[test-id="${askId}"]` );

    // Clicking tags option
    await this.page.waitForSelector( optionSelector );
    await this.page.click( optionSelector );
  }

  async clickGroupClickableWrapper ( askId ) {
    const selector = `[test-id="${askId}"]`;

    await this.page.waitForSelector( selector );

    await this.page.click( selector );
  }

  async click( testId, options = {}) {
    const { clickIndex = 0 } = options;
    const selector = `[test-id="${testId}"]`;

    await this.page.waitForSelector( selector );

    // Find the button the page
    const button = await this.page.$$( selector );

    // Click the element of index `clickIndex`
    await button[clickIndex].click();
  }

  async clickOnDiv(testId) {
    const selector = `[class="${testId}"]`;
    await this.page.waitForSelector( selector );
    //const button = await this.page.$$( selector );
    //await this.page.button.click();
    await expect( this.page ).toClick( selector );
  }
  
  async clickOnID(testId) {
    const selector = `[id="${testId}"]-actions`;
    await this.page.waitForSelector( selector );
    //const button = await this.page.$$( selector );
    //await this.page.button.click();
    await expect( this.page ).toClick( selector );
  }

  /* Make a normal click on an item with a testID */
  async clickOnTestId( testId ) {
    const selector = `[test-id="${testId}"]`;
    await this.page.waitForSelector( selector );

    await expect( this.page ).toClick( selector );
  }

  async getInnerSelection(id){
    const selector = `#${id}-actions`;
    await this.page.waitForSelector( selector );
    await this.page.click( selector );
  }

  async clickOnButtonId( testId ) {
    const selector = `[button id="${testId}"-actions]`;
    await this.page.waitForSelector( selector );

    await expect( this.page ).toClick( selector );
  }
  
  async ClickEvent(baseentityCode){
    const optionSelector = `[button id="${baseentityCode}"-actions]`;
    await page.evaluate(() => document.querySelector(optionSelector).scrollIntoView());
      await page.click(optionSelector);
  }

  //------
  // async checkIfGroupClickableWrapperWithoutBeExists
  // ( askId ) {
  //   const selector = `[data-testid="group-clickable-wrapper ${askId}"]`;
  //   const regexSelector = selector.match( /data-testid="group-clickable-wrapper.*$/g );
  //   const arrayValueregexSelector = `[${regexSelector[0]}`;

  //   if (( await this.page.$( arrayValueregexSelector )) !== null ) {
  //     console.log( 'Selector Exists!',  arrayValueregexSelector );
  //     return Promise.resolve( true );
  //   }
  //   return Promise.reject( Error( 'Selector not found', arrayValueregexSelector ));
  // }

  async checkIfGroupClickableWrapperExists
  ( askId ) {
    const selector = `[test-id="${askId}"]`;

    if (( await this.page.$( selector )) !== null ) {
      console.log( 'Selector Exists!' );
      return Promise.resolve( true );
    }
    return Promise.reject( Error( 'Selector not found' ));
  }

  async checkIfGroupClickableWrapperExistsAndClickID
  ( askId ) {
    const selector = `[test-id="${askId}"]`;
    let visible = true;

    await this.page
      .waitForSelector(selector, { visible: true,  timeout: 200 })
      .catch(() => {
        visible = false;
    });

    console.log('Visible value is ', visible);

    if (visible) {
            console.log( 'Selector Exists!' );
            return Promise.resolve( 'exists' );
    } else {
      console.log( 'Selector Does Not Exists!' );
      return Promise.resolve( 'does not exist' );
    }
    // return Promise.reject( Error( 'Selector not found' ));
  }

  async checkIfTestIDExists( testID ) {
    const selector = `[test-id="${testID}"]`;
    const fs = require( 'fs' );
    const fileName = 'result.txt';
    const checkforfile = filePath => {
      if ( fs.existsSync( filePath )) {
        console.log( filePath + ' exists' );
      }
    };
    const writefile = content => {
      fs.writeFile( fileName, content, err => {
        if ( err ) throw err;
      });
    };
    const readfile = fileName => {
      fs.readFile( fileName, ( err, data ) => {
        if ( err ) throw err;
        console.log( 'Content in ' + fileName + ' is ' + data.toString());
      });
    };
    await this.page.waitForSelector( selector );
    checkforfile( fileName );
    if (( await this.page.$( selector )) !== null ) {
      console.log( selector + ' Exists!' );
      let data = '1';
      writefile( data );
      readfile( fileName );
      return Promise.resolve( true );
    }
    let data = '0';
    writefile( data );
    readfile( fileName );
    return Promise.reject( Error( 'test ID not found' ));
  }

  async services() {
    const services =  new Services();
    return services;
  }
}



export default GennyDesktopBrowser;