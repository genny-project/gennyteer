import { SECONDS } from 'constants';
import { setDefaultOptions } from 'expect-puppeteer';

// Set maximum wait time for any element to 3 minutes
setDefaultOptions({ timeout: 240 * SECONDS });

// jest and their methods are automatically defined
jest.setTimeout( 100 * SECONDS );

class Actor {
  constructor( page ) {
    this.__setPage( page );
  }

  async __setPage( page ) {
    this.page = await page;
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

  async selectInput( askId, dropdownValue ) {
    await expect( this.page ).toClick( `[data-testid="input-dropdown ${askId}"]` );

    // Find the dropdown input on the page and select the dropdown value (usually baseentity code) from the items
    await this.page.select(
      `select[data-testid="input-dropdown ${askId}"]`,
      dropdownValue
    );
  }

  async selectTags( askId, options = {}) {
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
    const occupationButton = await this.page.$$( optionSelector );
    const addOccupation = await occupationButton[clickIndex];
    await addOccupation.click();
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

  async clickDropdown( testId = '', options = {}) {
    // Make a normal click but prefix it with `dropdown`
    await this.click( `dropdown ${testId}`, options );
  }

  async clickDropdownItem( testId = '', options = {}) {
    // Make a normal click but prefix it with `dropdown-item`
    await this.click( `dropdown-item ${testId}`, options );
  }
}

export default Actor;
