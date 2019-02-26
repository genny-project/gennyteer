# Gennyteer

Automated Browser testing of the Genny Project using Puppeteer.

## How to run the test

1. ./build-docker.sh

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

#### Reading data from Database, Cache, Frontend Store and Frontend Display

#### Store

```javascript
```

#### Cache

```javascript
const serviceInterface = new ServiceInterface();
assert
  .cache()
  .checkIfBaseEntityExists(
    (baseEntity = "PER_AGENT3_AT_GMAILCOM"),
    (attributeName = "PRI_FIRSTNAME"),
    (valueKey = "valueString"),
    (expectedValue = "Agent3")
  );
```

### Frontend

```javascript
```

#### Database

Please skip the database for now, its not tested
