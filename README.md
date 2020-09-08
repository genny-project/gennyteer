# Gennyteer

Automated browser testing stack of the Genny Project using Jest and Puppeteer. UAT, E2E and Regression tests.

## Stephs to run the test

1. Clone this project.
2. `cd` into the project and docker build it with `./build-docker.sh`
3. Mount test files into the docker container and run the testing suites.

#### Writing a basic Test

```javascript
// The following script is an example of how a testing suite is written
// While Gennyteer is project agnostic this example will login into internmatch and add a hostcompany

// import GennyDesktopBrowser class into the test script file
import { GennyDesktopBrowser } from "utils";

// Set a Jest timeout for the whole testing suite
jest.setTimeout( 60 * 1000000 );

describe( 'EXAMPLE GENNYTEET TEST 00001', () => {

  it( 'TEST CASE EGT0001 - It Should login as agent and test tree view', async () => {
    const user = await GennyDesktopBrowser.build( process.env.PASSED_GENNY_URL );

    // Login as user by entering login details into keycloak

    // await user.click('button');
    await user.inputTextUsingID( 'username', process.env.USER_A_USERNAME );
    await user.inputTextUsingID( 'password', process.env.USER_A_PASSWORD );
    await user.clickOnSelector( '#kc-login' );

    // wait 60 seconds as system is slow sometimes
    await user.sleep( 60 );

    await user.checkIfGroupClickableWrapperExists( 'QUE_DASHBOARD_VIEW' );
    await user.sleep( 10 );
    await user.checkIfGroupClickableWrapperExists( 'QUE_TAB_BUCKET_VIEW' );
    await user.sleep( 5 );
    await user.checkIfGroupClickableWrapperExists( 'QUE_TREE_ITEM_CONTACTS_GRP' );
    await user.sleep( 5 );
    await user.checkIfGroupClickableWrapperExists( 'QUE_TREE_ITEM_INTERNSHIPS_GRP' );
    await user.sleep( 5 );
    await user.checkIfGroupClickableWrapperExists( 'QUE_TREE_ITEM_HOST_COMPANIES_GRP' );
    await user.sleep( 5 );
    await user.checkIfGroupClickableWrapperExists( 'QUE_TREE_ITEM_EDU_PROVIDERS_GRP' );
    await user.sleep( 5 );

    await user.checkIfGroupClickableWrapperExists( 'QUE_ADD_ITEMS_GRP' );
    await user.sleep( 5 );
    await user.clickGroupClickableWrapper( 'QUE_ADD_ITEMS_GRP' );
    await user.sleep( 2 );
    await user.checkIfGroupClickableWrapperExists( 'QUE_HOST_CPY_MENU' );
    await user.sleep( 5 );

    await user.closeBrowser();
  });

});

```

# Input Elements

#### Fill input text

```javascript
await user.typeInputText("testid-text", "example");
```

#### Fill in Autocomplete

```javascript
await user.typeInputAutocomplete("testid-text", "address");
```

## Select

#### Select input dropdown

```javascript
await user.selectInputDropdown("teest-id-text", "example");
```

#### Select button using css

```javascript
await user.clickButtonUsingCSS('[data-testid="button"]');
```

## Click

#### Click on something

```javascript
await user.click("form-generic-submit");
await user.click("selector");
```

#### Click on testID

```javascript
await user.clickOnTestId("SEL_SOMETHING_FROM_TEST_ID");
```

#### click Sidebar Dropdown

```javascript
await user.clickSidebarDropdown("GRP_CODE_OF_SIDEBAR");
```

#### Click on sidebar item

```javascript
await user.clickSidebarItem("GRP_SIDEBAR_ITEM_GRP");
```

# Faker Methods

```javascript
user.faker().name.firstName(); // For generating Name
user.faker().name.lastName(); // For generating Name
user.faker().internet.email(); // for Email
usere.faker().picture(); // to generate Picture
usere.faker().phoneNumber(); // to generate phone number
```

# Service based helpers.

#### Reading data from Database, Cache, Frontend Store and Frontend Display

#### Store

```javascript
it("checks if the baseentity attribute value exists in the frontend store", async () => {
  const serviceInterface = new ServiceInterface();
  const store = await page.evaluate(() => window.store.getState());
  await user.services().baseEntityExists("BASE_ENTITY_NAME");
```

Ideally the above store check should be done while interacting with the page, because baseentitys is not received from the backend unless you are interacting with the baseentity itself.

Example: There won't be a list of contacts baseentitys in the store - where you are viewing internships table/page.

Note: base entitys are requested from the backend only when you want to interact with the particular base entity

#### Cache

```javascript
const serviceInterface = new ServiceInterface();
user
  .services()
  .cache()
  .checkIfBaseEntityAttributeValueExists(
    "PER_AGENT3_AT_GMAILCOM",
    "PRI_FIRSTNAME",
    "valueString",
    "Agent3"
  );
```

### Display (this checks if the selector exists in the screen)

```javascript
await user.checkIfSelectorExists(".selectorgoeshere");
```

#### Database

Please skip the database for now, its not tested

```javascript
await user
  .services()
  .database()
  .checkIfBaseEntityAttributeValueExists(
    "BE_CODE",
    "ATTR_CODE",
    "expectedValue"
  );
```

#### Get baseentity from Email

```javascript
await user
  .services()
  .database()
  .getBaseEntityFromEmail("email goes here");
```
