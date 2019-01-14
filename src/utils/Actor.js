import { SECONDS } from 'constants';
import { setDefaultOptions } from 'expect-puppeteer';

// Set maximum wait time for any element to 5 minutes
setDefaultOptions({ timeout: 300 * SECONDS });

class Actor {
  constructor( page ) {
    this.page = page;
  }

  async __fillTextBox( elementSelector, textValue ) {
    await expect( this.page ).toFill( elementSelector, textValue );
  }

  async __clickButton( elementSelector ) {
    await expect( this.page ).toClick( elementSelector );
  }

  // Click an event button with a button code in it
  async clickEventButton( buttonCode ) {
    await this.__clickButton( `[data-testid="event-button ${buttonCode}"]` );
  }

  // Click form button (either 'next' or 'submit')
  async clickFormButton() {
    await expect( this.page ).toClick( 'div[data-testid="button"]' );
  }

  // Enter address by partially filling the textbox, and then clicking on the first autofill option.
  async fillAddress( questionCode, answerValue ) {
    await expect( this.page ).toFill(
      `[data-testid="input-text ${questionCode}"]`,
      answerValue
    );
    await expect( this.page ).toClick(
      `[data-testid="input-autocomplete-item ${questionCode}"]`
    );
  }

  // Fill in a generic text box
  async fillTextBox( questionCode, answerValue ) {
    this.__fillTextBox( `[data-testid="input-text ${questionCode}"]`, answerValue );
  }

  async fillDropdown( questionCode, optionValue ) {
    await this.page.waitForSelector( `option[value="${optionValue}"]` );
    await this.page.select(
      `select[data-testid="input-dropdown ${questionCode}"]`,
      optionValue
    );
  }
}

export default Actor;
