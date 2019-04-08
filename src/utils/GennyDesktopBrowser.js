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
        'Store object doesnot exists on the window in pupptter please check Alyson v3 is updated to use the store Object'
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

  async navigateTo( websiteURL ) {
    const page = await this.page;
    await Promise.all( [
      page.goto( websiteURL ),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    ] );
  }

  //close the browser alltogether
  async closeBrowser() {
    const browser = await this.page.browser();
    await browser.close();
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

  //Screenshot this has not been tested yet
  async screenshot( fileName ) {
    const scShot = new ScSchot( this.page, fileName );
    scShot.shoot();
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
    const selector = `[data-testid="input-autocomplete ${askId}"]`;

    // Type into the autocmplete input
    await this.typeInputText( askId, text );
    this.sleep( 10 );
    // Wait for the element to load before continuing
    await this.page.waitForSelector( selector );

    // Click on the first autocomplete result
    await expect( this.page ).toClick( selector );
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

  async testMethod( askId = 'QUE_SELECT_COMPANY_TYPE', dropdownValue ) {
    await this.page.evaluate(() => {
      const test = document.querySelector(
        'select[data-testid="input-dropdown QUE_SELECT_COMPANY_TYPE"]'
      );
      console.log({ test });
    });

    await this.page.select(
      'select[data-testid="input-dropdown QUE_SELECT_COMPANY_TYPE"]',
      'SEL_COMPANY_HOST_COMPANY'
    );
  }

  async testMethodaddingintern( askId = 'QUE_SELECT_USER_TYPE', dropdownValue ) {
    await this.page.evaluate(() => {
      const test = document.querySelector(
        'select[data-testid="input-dropdown QUE_SELECT_USER_TYPE"]'
      );
      console.log({ test });
    });

    await this.page.select(
      'select[data-testid="input-dropdown QUE_SELECT_USER_TYPE"]',
      'SEL_USER_INTERN'
    );
  }

  async testMethodaddinghostcompanystaff( askId = 'QUE_SELECT_USER_TYPE', dropdownValue ) {
    await this.page.evaluate(() => {
      const test = document.querySelector(
        'select[data-testid="input-dropdown QUE_SELECT_USER_TYPE"]'
      );
      console.log({ test });
    });

    await this.page.select(
      'select[data-testid="input-dropdown QUE_SELECT_USER_TYPE"]',
      'SEL_USER_HOST_COMPANY_STAFF'
    );
  }

  async selectTag( askId, options = {}) {
    const { clickIndex = 0 } = options;
    const optionSelector = `[data-testid="input-tag-option ${askId}"]`;
    await this.page.waitForSelector( optionSelector );

    // There are no events or elements to wait for to make sure the tags are ready.
    // TODO: Make it happen
    console.log( 'Waiting for tags to load' );
    await this.page.waitFor( 4 * SECONDS );

    // Click the tags dropdown
    await this.click( `input-text input-tag ${askId}` );

    // Clicking tags option
    await this.page.waitForSelector( optionSelector );
    const tagSelection = await this.page.$$( optionSelector );
    const specificSelection = await tagSelection[clickIndex];
    await specificSelection.click();
    await this.click( `input-text input-tag ${askId}` );
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

  // Make a generic click that is compitable with all the clicks
  async genericClick( selector ) {
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

  /* Make a normal click on an sidebar item */
  async clickSidebarItem( testId ) {
    const selector = `[data-testid="sidebar-item ${testId}"]`;
    await expect( this.page ).toClick( selector );
  }
  async clickSideBarItemV2(testId){
    const selector = `[data-testid="sidebar-item-${testId}"]`;
    await expect( this.page ).toClick( selector );
  }

  async services() {
    const services =  new Services();
    return services;
  }
}

export default GennyDesktopBrowser;
