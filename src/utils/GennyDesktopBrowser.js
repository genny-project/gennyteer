import puppeteer from 'puppeteer';
import { SECONDS } from 'constants';
import faker from 'faker';
import ScSchot from './Screenshot';
import axios from 'axios';

const PAGE_WIDTH = 1920;
const PAGE_HEIGHT = 1080;

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
    // email Modification
    const originalEmail = faker.internet.email();
    console.log({ originalEmail });
    faker.internet.email = function() {
      const newEmail = `test_${originalEmail}`;
      return newEmail;
    };

    // First Name modification
    const originalName = faker.name.firstName();
    const newName = `test_${originalName}`;
    faker.name.firstName = function() {
      return newName;
    };

    // Last name modification
    const originalLastName = faker.name.lastName();
    const newLastName = `test_${originalLastName}`;
    faker.name.lastName = function() {
      return newLastName;
    };

    //Phone number modificaiton
    faker.phoneNumber = function() {
      return '0423274793';
    };

    faker.picture = async function() {
      const picture = await axios.get( 'https://thispersondoesnotexist.com/' );
      return picture;
    };

    return faker;
  }

  async getStore() {
    await this.page.evaluate(() => {
      console.log( window.store.getState());
      if ( window && window.store ) return window.store.getState();
      throw new Error(
        'Store object doesnot exists on the window in pupptter please check Alyson v3 is updated to use the store Object'
      );
    });
  }

  getPage() {
    return this.page;
  }

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

  async screenshot( fileName ) {
    const scShot = new ScSchot( this.page, fileName );
    scShot.shoot();
  }

  async clickOnSelector( selector ) {
    await expect( this.page ).toClick( selector );
  }

  async inputTextUsingID( id, text ) {
    const selector = `#${id}`;
    await this.inputTextBoxUsingCSS( selector, text );
  }

  async clickButtonUsingType( typeName ) {
    const selector = `button[type="${typeName}"]`;
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
    const selector = `[data-testid="input-autocomplete-item ${askId}"]`;

    // Type into the autocmplete input
    await this.typeInputText( askId, text );

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

  async selectTag( askId, options = {}) {
    const { clickIndex = 0 } = options;
    const optionSelector = `[data-testid="input-tag-option ${askId}"]`;

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

  async clickButton( testId = '', options = {}) {
    // Make a normal click but prefix it with `button`
    await this.click( `button ${testId}`, options );
  }

  // this is for clicking on the button on the header for example see internmatch header button
  async clickDropDownButtonUsingTestId(
    testId = 'ADD_ITEMS_DROPDOWN',
    options = {}
  ) {
    await this.click( `dropdown ${testId}`, options );
  }

  async clickGennyDropdown(
    testId,
    selectionId,
    dropdownOptions = {},
    dropdownItemOptions = {}
  ) {
    // Make a normal click but prefix it with `dropdown`
    await this.click( `dropdown ${testId}`, dropdownOptions );

    // Make a normal click but prefix it with `dropdown-item`
    await this.click( `dropdown-item ${selectionId}`, dropdownItemOptions );
  }

  /* Make a normal click on an item with a testID */
  async clickOnTestId( testId ) {
    await expect( this.page ).toClick( `[data-testid="${testId}"]` );
  }

  /* Make a normal click on a sidebar dropdown */
  async clickSidebarDropdown( testId ) {
    await expect( this.page ).toClick(
      `[data-testid="sidebar-dropdown ${testId}"]`
    );
  }

  async checkIfSelectorExists( selector ) {
    await this.page.waitForSelector( selector );
    if (( await this.page.$( selector )) !== null ) {
      console.log( 'Selector Exists!' );
      return true;
    }
    throw Error( ' Text not Found' );
  }

  /* Make a normal click on an sidebar item */
  async clickSidebarItem( testId ) {
    await expect( this.page ).toClick( `[data-testid="sidebar-item-${testId}"]` );
  }
}

export default GennyDesktopBrowser;
