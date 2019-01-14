import { SECONDS } from 'constants';

// jest and their methods are automatically defined
// eslint-disable-next-line no-undef
jest.setTimeout(100 * SECONDS);

class GennyTest {
  constructor(page) {
    this.page = page;
  }

  async typeInput(inputType, askId, text, options = {}) {
    const {
      waitTime = 5,
    } = options;

    await this.page.waitFor(waitTime * SECONDS);

    // Type into an input field on the page
    // eslint-disable-next-line no-undef
    await expect(this.page).toFill(`[data-testid="input-${inputType} ${askId}"]`, text);
  }

  async typeInputText(askId, text, options = {}) {
    // Type into an text input on the page
    await this.typeInput('text', askId, text, options);
  }

  async typeInputEmail(askId, text, options = {}) {
    // Type into an email input on the page
    await this.typeInput('email', askId, text, options);
  }

  async typeInputAutocomplete(askId, text) {
    // Type into the autocmplete input
    await this.typeInput(askId, text);

    // Click on the first autocomplete result
    // eslint-disable-next-line no-undef
    await expect(this.page).toClick(`[data-testid="input-autocomplete-item ${askId}"]`);
  }

  async selectInput(askId, baseEntityCode) {
    // Find the dropdown input on the page and select the baseEntityCode from the items
    await this.page.select(`select[data-testid="input-dropdown ${askId}"]`, baseEntityCode);
  }

  async click(testId, options = {}) {
    const {
      waitTime = 3,
      clickIndex = 0,
    } = options;

    await this.page.waitFor(waitTime * SECONDS);

    // Find the button the page
    const button = this.page.$$(`[data-testid="${testId}"]`);

    // Click the element of index `clickIndex`
    await button[clickIndex].click();
  }

  async clickButton(testId = '', options = {}) {
    // Make a normal click but prefix it with `button`
    await this.click(`button ${testId}`, options);
  }

  async clickDropdown(testId = '', options = {}) {
    // Make a normal click but prefix it with `dropdown`
    await this.click(`dropdown ${testId}`, options);
  }

  async clickDropdownItem(testId = '', options = {}) {
    // Make a normal click but prefix it with `dropdown-item`
    await this.click(`dropdown-item ${testId}`, options);
  }
}

export default GennyTest;
