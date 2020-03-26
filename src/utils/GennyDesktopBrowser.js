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

  async inputTextUsingID( id, text ) {
    const selector = `#${id}`;
    await this.page.waitForSelector( selector );
    await this.inputTextBoxUsingCSS( selector, text );

  }

  async inputTextUsingTestID( id,text ){
    const selector=`[data-testid="input-text ${id}"]`;
    await this.page.click( selector );
    await this.page.keyboard.type( text );

  }

  async clickButtonUsingType( typeName ) {
    const selector = `button[type="${typeName}"]`;
    await this.page.waitForSelector( selector );
    this.clickButtonUsingCSS( selector );
  }

  async clickButtonUsingClass( className ) {
    const selector = `.${className}`;
    await this.page.waitForSelector( selector );
    await this.page.click( selector );
  }



  async inputTextBoxUsingCSS( selector, text, options = {}) {
    await this.page.waitForSelector( selector, options );
    // Type into an input field on the page
    await expect( this.page ).toFill( selector, text );
  }

  async clickButtonUsingCSS( selector, options = {}) {
    await this.page.waitForSelector( selector, options );
    await expect( this.page ).toClick( selector );
  }

  async typeInput( inputType, askId, text, options = {}) {
    let selector = `[data-testid="input-${inputType} ${askId}"]`;
    await this.page.waitForSelector( selector, options );

    // Type into an input field on the page
    await expect( this.page ).toFill( selector, text );
  }

  async typeInputText( askId, text, options = {}) {
    // Type into an text input on the page
    await this.typeInput( 'text', askId, text, options );
  }

  async typeInputEmail( askId, text, options = {}) {
    // Type into an email input on the page
    await this.typeInput( 'email', askId, text, options );
  }

  async typeInputAutocomplete( askId, text ) {
    const selector = `[data-testid="input-text ${askId}"]`;

    // Type into the autocmplete input
    await this.typeInputText( askId, text );
    await this.page.waitFor( 5 * SECONDS );

    // Wait for the element to load before continuing
    await this.page.waitForSelector( selector );

    // Click on the first autocomplete result
    const selectorItem = `[data-testid="input-autocomplete-item ${askId}"]`;
    await expect( this.page ).toClick( selectorItem );
  }

  async selectInputDropdown( askId, dropdownValue ) {
    // Click the dropdown
    await expect( this.page ).toClick( `[data-testid="input-dropdown ${askId}"]` );

    // Find the dropdown input on the page and select the dropdown value (usually baseentity code) from the items
    // This is different from just clicking on it. Puppeteer uses the select function.
    await this.page.select(
      `select[data-testid="input-dropdown ${askId}"]`,
      dropdownValue
    );
  }

  async selectTag
  ( askId, options = {}) {
    const { clickIndex = 0 } = options;
    const optionSelector = `[data-testid="input-tag-option ${askId}"]`;
    const regexOptionSelector = optionSelector.match( /data-testid="input-tag-option.*$/g );
    const arrayValueOptionSelector = `[${regexOptionSelector[0]}`;

    await this.page.waitFor( 5 * SECONDS );

    // Click the tags dropdown
    await this.click( `input-text input-tag ${askId}` );

    // Clicking tags option
    await this.page.waitForSelector( optionSelector );
    const tagSelection = await this.page.$$( arrayValueOptionSelector );
    const specificSelection = await tagSelection[clickIndex];
    await specificSelection.click();
  }

  async selectSpecificTag
  ( askId, baseentityCode ) {
    const optionSelector = `[data-testid="input-item ${askId}:${baseentityCode}"]`;

    // There are no events or elements to wait for to make sure the tags are ready.
    // TODO: Make it happen
    await this.page.waitFor( 5 * SECONDS );

    // Click the tags dropdown
    await this.click( `input-field ${askId}` );

    // Clicking tags option
    await this.page.waitForSelector( optionSelector );
    await this.page.click( optionSelector );
  }

  async clickGroupClickableWrapper
  ( askId, baseentityCode ) {
    const selector = `[data-testid="group-clickable-wrapper ${askId}:${baseentityCode}"]`;

    await this.page.waitForSelector( selector );

    await this.page.click( selector );
  }

  async click( testId, options = {}) {
    const { clickIndex = 0 } = options;
    const selector = `[data-testid="${testId}"]`;

    await this.page.waitForSelector( selector );

    // Find the button the page
    const button = await this.page.$$( selector );

    // Click the element of index `clickIndex`
    await button[clickIndex].click();
  }

  // click button using testid
  async clickButton( testId = '', options = {}) {
    // Make a normal click but prefix it with `button`
    await this.click( `button ${testId}`, options );
  }

  async clickOnTestIDButton() {
    const clickIndex = 0;
    const selector = '[data-testid="button"]';
    await this.page.waitForSelector( selector );
    const button = await this.page.$$( selector );
    await button[clickIndex].click();
  }

  // this is for clicking on the button on the header for example see internmatch header button
  async clickDropDownButtonUsingTestId(
    testId = 'ADD_ITEMS_DROPDOWN',
    options = {}
  ) {
    const selector = `dropdown ${testId}`;
    this.page.waitForSelector( selector );
    await this.click( selector, options );
  }

  async clickGennyDropdown(
    testId,
    selectionId,
    dropdownOptions = {},
    dropdownItemOptions = {}
  ) {
    // Make a normal click but prefix it with `dropdown`
    await this.click( `dropdown ${testId}`, dropdownOptions );
    this.sleep( 2 );
    // Make a normal click but prefix it with `dropdown-item`
    await this.click( `dropdown-item ${selectionId}`, dropdownItemOptions );
  }

  async clickDropDownItem( testID ) {
    const selector = `[data-testid="dropdown-item ${testID}"]`;
    await this.page.waitForSelector( selector );
    await expect( this.page ).toClick( selector );
  }

  /* Make a normal click on an item with a testID */
  async clickOnTestId( testId ) {
    const selector = `[data-testid="${testId}"]`;
    await this.page.waitForSelector( selector );

    await expect( this.page ).toClick( selector );
  }

  /* Make a normal click on a sidebar dropdown */
  async clickSidebarDropdown( testId ) {
    const selector = `[data-testid="sidebar-dropdown ${testId}"]`;
    await expect( this.page ).toClick( selector );
  }

  // Check if the seelector exists or Not
  async checkIfSelectorExists( selector ) {
    await this.page.waitForSelector( selector );
    if (( await this.page.$( selector )) !== null ) {
      console.log( 'Selector Exists!' );
      return Promise.resolve( true );
    }
    return Promise.reject( Error( 'Selector not found' ));
  }

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
  ( askId, baseentityCode ) {
    const selector = `[data-testid="group-clickable-wrapper ${askId}:${baseentityCode}"]`;

    if (( await this.page.$( selector )) !== null ) {
      console.log( 'Selector Exists!' );
      return Promise.resolve( true );
    }
    return Promise.reject( Error( 'Selector not found' ));
  }

  async checkIfTestIDExists( testID ) {
    const selector = `[data-testid="${testID}"]`;
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

  /* Make a normal click on an sidebar item */
  async clickSidebarItem( testId ) {
    const selector = `[data-testid="sidebar-item ${testId}"]`;
    await expect( this.page ).toClick( selector );
  }

  async clickSideBarItemV2( testId ){
    const selector = `[data-testid="sidebar-item-${testId}"]`;
    await expect( this.page ).toClick( selector );
  }

  async datePicker( id ){
    const selector=`[data-testid="input-date-picker ${id}"]`;
    await this.page.click( selector );

    await this.page.waitFor( 2 * SECONDS );

    // Click the the exact day
    await this.click( `input-date-picker-option input-date-picker-day ${id}` );
    // await this.page.keyboard.type( text );
  }

  async services() {
    const services =  new Services();
    return services;
  }
}

export default GennyDesktopBrowser;
