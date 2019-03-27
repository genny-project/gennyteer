# Gennyteer

Automated Browser testing of the Genny Project using Puppeteer.

## How to run the test

1. `./build-docker.sh`

#### Writing a basic Test

```javascript
import { GennyDesktopBrowser } from "utils";
// do something
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

# Service based helpers

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
