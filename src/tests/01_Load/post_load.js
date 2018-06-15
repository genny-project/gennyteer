import { PAGE_WIDTH, PAGE_HEIGHT, TEST_TIMEOUT, JOB_ID } from 'constants';
import { Screenshot } from 'utils';
import puppeteer from  'puppeteer';

const shot = new Screenshot( 'post_load' );

let A_loadOwner, A_LOBrowser;
let B_truckDriver, B_TDBrowser;
let C_truckDriver, C_TDBrowser;


jest.setTimeout( 60000 );


describe( 'Load Posting', () => {
  beforeAll( async () => {
    A_LOBrowser = await puppeteer.launch({ args: [ '--no-sandbox' ] });
    B_TDBrowser = await puppeteer.launch({ args: [ '--no-sandbox' ] });
    C_TDBrowser = await puppeteer.launch({ args: [ '--no-sandbox' ] });    

    A_loadOwner = await A_LOBrowser.newPage();
    B_truckDriver = await B_TDBrowser.newPage();
    C_truckDriver = await C_TDBrowser.newPage();

    A_loadOwner.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });

    B_truckDriver.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });

    C_truckDriver.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });



    await A_loadOwner.goto( process.env.CHANNEL40_URL );
    await B_truckDriver.goto( process.env.CHANNEL40_URL );
    await C_truckDriver.goto( process.env.CHANNEL40_URL );
    await C_truckDriver.waitFor(15000);

    await Promise.all( [

      expect( A_loadOwner ).toFillForm( 'body', {
        username: process.env.LOADOWNER_USERNAME,
        password: process.env.LOADOWNER_PASSWORD,
      }),

      expect( B_truckDriver ).toFillForm( 'body', {
        username: process.env.TRUCKDRIVER_B_USERNAME,
        password: process.env.TRUCKDRIVER_B_PASSWORD,
      }),

      expect( C_truckDriver ).toFillForm( 'body', {
        username: process.env.TRUCKDRIVER_C_USERNAME,
        password: process.env.TRUCKDRIVER_C_PASSWORD,
      })

    ] );

    await Promise.all( [
      expect( A_loadOwner ).toClick( 'button', { text: 'Login' }),
      expect( B_truckDriver ).toClick( 'button', { text: 'Login' }),
      expect( C_truckDriver ).toClick( 'button', { text: 'Login' })
    ] );

    await Promise.all( [
      A_loadOwner.waitFor( '#GRP_NEW_ITEMS > div > button' ),
      B_truckDriver.waitFor( 'div > div > div.grid.sub-header > div > div > div > ul > li > span:nth-child(2)' ),
      C_truckDriver.waitFor( 'div > div > div.grid.sub-header > div > div > div > ul > li > span:nth-child(2)' )
    ] );
  });

  afterEach( async () => {
    await shot.shoot( A_loadOwner, 'LO_AFTER' );
    await shot.shoot( B_truckDriver, 'DR_B_AFTER' );
    await shot.shoot( C_truckDriver, 'DR_C_AFTER' );
  });

  afterAll( async () => {
    await A_LOBrowser.close();
    await B_TDBrowser.close();
    await C_TDBrowser.close();
  });

  it ( 'should open ADD LOAD page', async () => {
    await A_loadOwner.click( '#GRP_NEW_ITEMS > div > button' );
    await A_loadOwner.waitFor( '.genny-form', {timeout: 30000});
  });

  it ( 'should submit load and time the roundtrip', async () => {

    const pages = [
      {page: A_loadOwner, name: 'loadownerA'},
      {page: B_truckDriver, name: 'truckdriverB'},
      {page: C_truckDriver, name: 'truckdriverC'}
    ];

    await A_loadOwner.waitFor( 30000 );
    console.log( `adding load ${JOB_ID}` );
    await A_loadOwner.type( '.QUE_LOAD_NAME input', JOB_ID );
    await A_loadOwner.type( '.QUE_LOAD_DESC textarea', 'THIS IS A TEST LOAD' );
    await shot.shoot( A_loadOwner, 'LO' );
    await shot.shoot( A_loadOwner, 'LO' );
    await A_loadOwner.click( '#downshift-1-input' );
    await A_loadOwner.type( '#downshift-1-input', 'a' );
    await shot.shoot( A_loadOwner, 'LO' );
    await A_loadOwner.click( '#downshift-1-item-0' );
    await shot.shoot( A_loadOwner, 'LO' );


    //measurements

    await A_loadOwner.type( '.QUE_LOAD_LENGTH input', '1' );
    await A_loadOwner.type( '.QUE_LOAD_WIDTH input', '1' );
    await A_loadOwner.type( '.QUE_LOAD_HEIGHT input', '1' );
    await A_loadOwner.type( '.QUE_LOAD_WEIGHT input', '1' );
    await shot.shoot( A_loadOwner, 'LO' );


    //pickup address

    await A_loadOwner.type( '.QUE_JOB_PICKUP_ADDRESS_FULL input', '121 cardigan st' );
    await A_loadOwner.waitFor( 'div:nth-child(2) > div:nth-child(2) > div > div.grid > div > div:nth-child(1) > div > div > div:nth-child(1)' );
    await A_loadOwner.click( 'div:nth-child(2) > div:nth-child(2) > div > div.grid > div > div:nth-child(1) > div > div > div:nth-child(1)' );
    await shot.shoot( A_loadOwner, 'LO' );


    //pickup time

    await A_loadOwner.click( '.QUE_JOB_PICKUP_DATE_TIME input' );
    await A_loadOwner.waitFor( 'div.react-datepicker-popper > div > div.react-datepicker__time-container > div.react-datepicker__time > div > ul > li.react-datepicker__time-list-item' );
    await A_loadOwner.click( 'div.react-datepicker-popper > div > div.react-datepicker__time-container > div.react-datepicker__time > div > ul > li.react-datepicker__time-list-item', {
      delay: 100
    });
    await shot.shoot( A_loadOwner, 'LO' );

    // delivery address input

    await A_loadOwner.click( 'div:nth-child(2) > div > div > div > div > div:nth-child(2) > div:nth-child(4) > div > div.grid > div > div:nth-child(1) > div > input' );
    await A_loadOwner.type( 'div:nth-child(2) > div > div > div > div > div:nth-child(2) > div:nth-child(4) > div > div.grid > div > div:nth-child(1) > div > input', '272 Lygon St, Carlton' );
    await A_loadOwner.waitFor( 'div:nth-child(2) > div:nth-child(4) > div > div.grid > div > div:nth-child(1) > div > div > div:nth-child(1)' );
    await A_loadOwner.click( 'div:nth-child(2) > div:nth-child(4) > div > div.grid > div > div:nth-child(1) > div > div > div:nth-child(1)' );
    await shot.shoot( A_loadOwner, 'LO' );

    //submission

    await A_loadOwner.waitFor( 'div:nth-child(2) > div:nth-child(2) > div > div > div > div > div.grid > div > div:nth-child(2) > div > button:enabled' );
    await A_loadOwner.click( 'div:nth-child(2) > div:nth-child(2) > div > div > div > div > div.grid > div > div:nth-child(2) > div > button:enabled' );
    const loadSubmitted = Date.now();

    const results = await Promise.all(
      pages.map( async page => {
        try {
          await expect( page.page ).toMatchElement( 'h5', {text: JOB_ID, timeout: 20000});
          console.log(page.name + ' found load')
          return {
            time: Date.now() - loadSubmitted,
            name: page.name
          };
        } catch( e ) {

          //sometimes the posted load doesn't show up, this covers that case
          console.log( 'refreshing ' + page.name );
          await page.page.reload();
          await page.page.waitFor( 1000 );
          console.log( 'refreshed and waited ' + page.name );
          await expect( page.page ).toMatchElement( 'h5', {text: JOB_ID, timeout: 20000});
          console.log(page.name + ' found load')

          return {
            time: Date.now() - loadSubmitted,
            name: page.name.concat( ' !! reloaded !! ' )
          };
        }
      })
     );

    results.forEach( result => {
      console.log( `${result.name} found the load in: ${result.time}ms` );
    });

    await shot.shoot( B_truckDriver, 'TD_B' );
    await shot.shoot( C_truckDriver, 'TD_C' );
  });

  it ( 'submit a quote as Driver B', async () => {
    await expect( B_truckDriver ).toClick( 'h5', {text: JOB_ID, timeout: 30000});
    await expect( B_truckDriver ).toClick( 'span', {text: 'View Load Details', timeout: 30000});

    await B_truckDriver.waitFor( '#BTN_MAKE_OFFER > div > button' );

    await B_truckDriver.evaluate(() => document.querySelector( '#BTN_MAKE_OFFER > div > button' ).click());
    await shot.shoot( B_truckDriver, 'TD_B' );

    await B_truckDriver.waitFor( 1000 );
    await shot.shoot( B_truckDriver, 'TD_B' );

    const quoteInput = await expect( B_truckDriver ).toMatchElement( '.QUE_OFFER_DRIVER_PRICE > input', {timeout: 30000});
    await shot.shoot( B_truckDriver, 'TD_B' );

    await quoteInput.click();
    await quoteInput.type( '10' );
    await B_truckDriver.keyboard.press( 'Enter' );

    B_truckDriver.on( 'dialog', dialog => dialog.accept());

    await B_truckDriver.waitFor( 'div.modal button:enabled' );
    await B_truckDriver.click( 'div.modal button:enabled' );
    const submittedTime = Date.now();

    await A_loadOwner.waitForXPath( `//h5[text()="${JOB_ID}"]/following-sibling::div[2]//span[2][text()="1"]` );
    console.log( `A found B quote at ${Date.now() - submittedTime}ms` );
  });

  it ( 'C driver should not be able to see B quote', async () => {

    await expect( C_truckDriver ).toClick( 'h5', {text: JOB_ID, timeout: 30000});
    await expect( C_truckDriver ).toClick( 'span', {text: 'View Load Details', timeout: 30000});

    // makes sure this throws error, because it shouldn't find the quote
    await expect( expect( C_truckDriver ).toMatch( /\$10\.00/, {timeout: 30000})).rejects.toThrow();
    await shot.shoot( C_truckDriver, 'TD_C_CHECK' );
  });

  it ( 'B driver should be able to see B quote', async () => {
    await expect( B_truckDriver ).toClick( 'h5', {text: JOB_ID, timeout: 30000});
    await expect( B_truckDriver ).toClick( 'span', {text: 'View Load Details', timeout: 30000});
    await expect( B_truckDriver ).toMatch( /\$10\.00/, {timeout: 30000});
    await shot.shoot( B_truckDriver, 'TD_B_CHECK' );
  });

  it ( 'submit a quote as Driver C', async () => {
    //refreshing to get back to home
    await C_truckDriver.reload();
    await B_truckDriver.reload();
    B_truckDriver.waitFor( 'div > div > div.grid.sub-header > div > div > div > ul > li > span:nth-child(2)' );
    C_truckDriver.waitFor( 'div > div > div.grid.sub-header > div > div > div > ul > li > span:nth-child(2)' );
    
    await expect( C_truckDriver ).toClick( 'h5', {text: JOB_ID, timeout: 10000});
    await expect( C_truckDriver ).toClick( 'span', {text: 'View Load Details', timeout: 10000});

    await C_truckDriver.waitFor( '#BTN_MAKE_OFFER > div > button' );

    await C_truckDriver.evaluate(() => document.querySelector( '#BTN_MAKE_OFFER > div > button' ).click());
    await shot.shoot( C_truckDriver, 'TD_C' );

    await C_truckDriver.waitFor( 1000 );
    await shot.shoot( C_truckDriver, 'TD_C' );

    const quoteInput = await expect( C_truckDriver ).toMatchElement( '.QUE_OFFER_DRIVER_PRICE > input', {timeout: 10000});
    await shot.shoot( C_truckDriver, 'TD_C' );

    await quoteInput.click();
    await quoteInput.type( '100' );
    await C_truckDriver.keyboard.press( 'Enter' );

    C_truckDriver.on( 'dialog', dialog => dialog.accept());

    await C_truckDriver.waitFor( 'div.modal button:enabled' );
    await C_truckDriver.click( 'div.modal button:enabled' );
    const submittedTime = Date.now();

    await A_loadOwner.waitForXPath( `//h5[text()="${JOB_ID}"]/following-sibling::div[2]//span[2][text()="2"]` );
    console.log( `A found C quote at ${Date.now() - submittedTime}ms` );
  });

  it ( 'B driver should not be able to see C quote', async () => {

    await expect( B_truckDriver ).toClick( 'h5', {text: JOB_ID, timeout: 10000});
    await expect( B_truckDriver ).toClick( 'span', {text: 'View Load Details', timeout: 10000});

    // makes sure this throws error, because it shouldn't find the quote
    await expect( expect( B_truckDriver ).toMatch( /\$100\.00/, {timeout: 10000})).rejects.toThrow();
    await shot.shoot( B_truckDriver, 'TD_C_CHECK' );
    await B_truckDriver.reload();
  });

  it ( 'C driver should be able to see C quote', async () => {
    await C_truckDriver.reload();
    await C_truckDriver.waitFor(2000);
    await expect( C_truckDriver ).toClick( 'h5', {text: JOB_ID, timeout: 10000});
    await expect( C_truckDriver ).toClick( 'span', {text: 'View Load Details', timeout: 10000});
    await expect( C_truckDriver ).toMatch( /\$100\.00/, {timeout: 10000});
    await shot.shoot( C_truckDriver, 'TD_B_CHECK' );
    await C_truckDriver.reload();
  });

  it ( 'A Load Owner should accept quote no. 1', async () => {
    await shot.shoot( A_loadOwner, 'NEW_A' ); 
    await A_loadOwner.reload();
    await C_truckDriver.waitFor(2000);

    await expect( A_loadOwner ).toClick( 'h5', {text: JOB_ID, timeout: 10000});
    await expect( A_loadOwner ).toClick( 'span', {text: 'ACCEPT', timeout: 20000});
    try {
      await expect( A_loadOwner ).toClick( 'i', {text: 'account_balance', timeout: 40000});
    } catch(e) {
      console.log('payments failed'); 
      await shot.shoot( A_loadOwner, 'PAYMENTS_FAILED' );
      throw e;
    }
    await expect( A_loadOwner ).toClick( 'span', {text: 'NEXT', timeout: 20000});

    await expect( A_loadOwner ).toClick( 'div.payment-method', {timeout: 10000});
    await expect( A_loadOwner ).toClick( 'span', {text: 'NEXT', timeout: 10000});

    await expect( A_loadOwner ).toClick( 'div.confirm-btn', {timeout: 10000});
  });

  it ( 'Truck Driver should pick up the load', async () => {
    try {
      await shot.shoot( B_truckDriver, 'PICK_UP_LOAD_B' );
      await B_truckDriver.reload();
      await B_truckDriver.waitFor(12000);
      await shot.shoot( B_truckDriver, 'PICK_UP_LOAD_B' );
      const pickUpLoadBtn = await B_truckDriver.waitForXPath( `//h5[text()="${JOB_ID}"]/ancestor::div[4]/div[last()]/div/div/button` );
      await pickUpLoadBtn.click();
      await shot.shoot( B_truckDriver, 'PICK_UP_LOAD_B' );
      console.log('truck driver b picked up load');
      await B_truckDriver.reload();
    } catch (e) {
      console.log(e);
      await shot.shoot( B_truckDriver, 'PICK_UP_LOAD_B_FAILED' );
      await shot.shoot( C_truckDriver, 'PICK_UP_LOAD_C' );
      await C_truckDriver.reload();
      await C_truckDriver.waitFor(12000);
      await shot.shoot( C_truckDriver, 'PICK_UP_LOAD_C' );
      const pickUpLoadBtn = await C_truckDriver.waitForXPath( `//h5[text()="${JOB_ID}"]/ancestor::div[4]/div[last()]/div/div/button` );
      await pickUpLoadBtn.click();
      await shot.shoot( C_truckDriver, 'PICK_UP_LOAD_C' );
      console.log('truck driver c picked up load');
      await C_truckDriver.reload();
    }
  });

  // it ( 'Load Owner A should see the load is marked as picked up', async () => {
  //   await B_truckDriver.waitForXPath( `//h5[text()="${JOB_ID}"]/ancestor::div[4]/div[last()]` );
  // });

  it ( 'Truck Driver mark the load as delivered', async () => {
    try {
      await shot.shoot( B_truckDriver, 'DELIVER_LOAD_B' );
      const deliverBtn = await B_truckDriver.waitForXPath( `//h5[text()="${JOB_ID}"]/ancestor::div[4]/div[last()]/div/div/button` )
      deliverBtn.click();
      await shot.shoot( B_truckDriver, 'DELIVER_LOAD_B' );
    } catch(e) {
      await shot.shoot( C_truckDriver, 'DELIVER_LOAD_C' );
      const deliverBtn = await C_truckDriver.waitForXPath( `//h5[text()="${JOB_ID}"]/ancestor::div[4]/div[last()]/div/div/button` )
      deliverBtn.click();
      await shot.shoot( C_truckDriver, 'DELIVER_LOAD_C' );
    }

  });

  }, TEST_TIMEOUT );
