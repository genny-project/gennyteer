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

# Commonly Used Action Methods

#### Fill Input Text

```javascript
await user.inputTextUsingTestID("testid-text", "input-value");
```

#### Fill in Autocomplete

```javascript
await user.typeInputAutocomplete("testid-text", "input-value", "input-value-element");
```

## Select

#### Select Specific Input Dropdown Element

```javascript
await user.selectSpecificTag("teest-id-text", "example");
```

## Click

#### Click on an Element

```javascript
await user.clickGroupClickableWrapper("form-generic-submit");
await user.click('button');
```

#### Click on testID

```javascript
await user.clickOnTestId("QUE_XXXXXXXXX");
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

### Display (this checks if the selector exists)

```javascript
await user.checkIfGroupClickableWrapperExists(".selectorgoeshere");
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
