# Gennyteer

Automated Browser testing of the Genny Project using Puppeteer.

## How to run the test

1. ./build-docker.sh

### Writing a basic Test

```javascript
import { GennyDesktopBrowser } from "utils";
// do something
```

# Input Elements

### Fill input text

```javascript
await user.typeInputText("testid-text", "example");
```

### Fill in Autocomplete

```javascript
await user.typeInputAutocomplete("testid-text", "address");
```

## Select

### Select input dropdown

```javascript
await user.selectInputDropdown("teest-id-text", "example");
```

### Select button using css

```javascript
await user.clickButtonUsingCSS('[data-testid="button"]');
```

## Click

### Click on something

```javascript
await user.click("form-generic-submit");
await user.click("selector");
```

### Click on testID

```javascript
await user.clickOnTestId("SEL_DETAIL_VIEW");
```

### click Sidebar Dropdown

```javascript
await user.clickSidebarDropdown("GRP_CODE");
```

### Click on sidebar item

```javscript
    await user.clickSidebarItem("GRP_PRIVACY");
```
