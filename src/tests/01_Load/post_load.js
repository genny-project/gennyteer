import { PAGE_WIDTH, PAGE_HEIGHT, TEST_TIMEOUT, JOB_ID } from 'constants';
import { Screenshot } from 'utils';
import puppeteer from  'puppeteer';

const shot = new Screenshot( 'post_load' );

let loadOwner, truckDriver,  LOBrowser, TDBrowser;


jest.setTimeout( 60000 );


describe( 'Load Posting', () => {
  beforeAll( async () => {
    LOBrowser = await puppeteer.launch();
    TDBrowser = await puppeteer.launch();

    loadOwner = await LOBrowser.newPage();
    truckDriver = await TDBrowser.newPage();

    loadOwner.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });

    truckDriver.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });

    await truckDriver.goto( process.env.CHANNEL40_URL );
    await loadOwner.goto( process.env.CHANNEL40_URL );

    await Promise.all( [

      expect( loadOwner ).toFillForm( 'body', {
        username: process.env.LOADOWNER_USERNAME,
        password: process.env.LOADOWNER_PASSWORD,
      }),

      expect( truckDriver ).toFillForm( 'body', {
        username: process.env.TRUCKDRIVER_USERNAME,
        password: process.env.TRUCKDRIVER_PASSWORD,
      })

    ] );

    await Promise.all( [
      expect( loadOwner ).toClick( 'button', { text: 'Login' }),
      expect( truckDriver ).toClick( 'button', { text: 'Login' })
    ] );

    await Promise.all( [
      loadOwner.waitFor( '#GRP_NEW_ITEMS > div > button' ),
      truckDriver.waitFor( 'div > div > div.grid.sub-header > div > div > div > ul > li > span:nth-child(2)' )
    ] );
  });

  afterEach( async () => {
    await shot.shoot( loadOwner, 'LO_AFTER' );
    await shot.shoot( truckDriver, 'DR_AFTER' );
  });

  afterAll( async () => {
    await TDBrowser.close();
    await LOBrowser.close();
  });

  it ( 'should open ADD LOAD page', async () => {
    await loadOwner.click( '#GRP_NEW_ITEMS > div > button' );
    await loadOwner.waitFor( '.genny-form', {timeout: 15000});
  });

  it ( 'should submit load and time the roundtrip', async () => {
    console.log( `adding load ${JOB_ID}` );
    await loadOwner.type( '.QUE_LOAD_NAME input', JOB_ID );
    await loadOwner.type( '.QUE_LOAD_DESC textarea', 'THIS IS A TEST LOAD' );
    await shot.shoot( loadOwner, 'LO' );
    await loadOwner.click( '#downshift-1-input' );
    await loadOwner.click( '#downshift-1-item-0' );


    await loadOwner.type( '.QUE_LOAD_LENGTH input', '1' );
    await loadOwner.type( '.QUE_LOAD_WIDTH input', '1' );
    await loadOwner.type( '.QUE_LOAD_HEIGHT input', '1' );
    await loadOwner.type( '.QUE_LOAD_WEIGHT input', '1' );
    await shot.shoot( loadOwner, 'LO' );
    console.log( 'measurements input' );

    await loadOwner.type( '.QUE_JOB_PICKUP_ADDRESS_FULL input', '121 cardigan st' );
    await loadOwner.waitFor( 'div:nth-child(2) > div:nth-child(2) > div > div.grid > div > div:nth-child(1) > div > div > div:nth-child(1)' );
    await loadOwner.click( 'div:nth-child(2) > div:nth-child(2) > div > div.grid > div > div:nth-child(1) > div > div > div:nth-child(1)' );
    await shot.shoot( loadOwner, 'LO' );
    console.log( 'pickup address input' );

    await loadOwner.click( '.QUE_JOB_PICKUP_DATE_TIME input' );
    await loadOwner.waitFor( 'div.react-datepicker-popper > div > div.react-datepicker__time-container > div.react-datepicker__time > div > ul > li.react-datepicker__time-list-item' );
    await loadOwner.click( 'div.react-datepicker-popper > div > div.react-datepicker__time-container > div.react-datepicker__time > div > ul > li.react-datepicker__time-list-item', {
      delay: 100
    });
    await shot.shoot( loadOwner, 'LO' );
    console.log( 'available from input' );

    await loadOwner.click( 'div:nth-child(2) > div > div > div > div > div:nth-child(2) > div:nth-child(4) > div > div.grid > div > div:nth-child(1) > div > input' );
    await loadOwner.type( 'div:nth-child(2) > div > div > div > div > div:nth-child(2) > div:nth-child(4) > div > div.grid > div > div:nth-child(1) > div > input', '272 Lygon St, Carlton' );
    await loadOwner.waitFor( 'div:nth-child(2) > div:nth-child(4) > div > div.grid > div > div:nth-child(1) > div > div > div:nth-child(1)' );
    await loadOwner.click( 'div:nth-child(2) > div:nth-child(4) > div > div.grid > div > div:nth-child(1) > div > div > div:nth-child(1)' );
    await shot.shoot( loadOwner, 'LO' );
    console.log( 'delivery address input' );

    await loadOwner.waitFor( 'div:nth-child(2) > div:nth-child(2) > div > div > div > div > div.grid > div > div:nth-child(2) > div > button:enabled' );
    await loadOwner.click( 'div:nth-child(2) > div:nth-child(2) > div > div > div > div > div.grid > div > div:nth-child(2) > div > button:enabled' );
    const loadSubmitted = Date.now();

    await expect( truckDriver ).toMatchElement( 'h5', {text: JOB_ID, timeout: 10000});
    const loadPulled = Date.now();
    await shot.shoot( truckDriver, 'TD' );

    console.log( `FULL LOAD TIME: ${loadPulled - loadSubmitted}ms` );
  });

  it ( 'should open the load info page', async () => {
    await expect( truckDriver ).toClick( 'h5', {text: JOB_ID, timeout: 10000});
    await expect( truckDriver ).toClick( 'span', {text: 'View Load Details', timeout: 10000});

    await truckDriver.waitFor( '#BTN_MAKE_OFFER > div > button' );

    await truckDriver.evaluate(() => document.querySelector( '#BTN_MAKE_OFFER > div > button' ).click());
    await shot.shoot( truckDriver, 'TD' );

    await truckDriver.waitFor( 1000 );
    await shot.shoot( truckDriver, 'TD' );

    const quoteInput = await expect( truckDriver ).toMatchElement( '.QUE_OFFER_DRIVER_PRICE > input', {timeout: 10000});
    await shot.shoot( truckDriver, 'TD' );

    await quoteInput.click();
    await quoteInput.type( '10' );
    await truckDriver.keyboard.press( 'Enter' );

    truckDriver.on( 'dialog', dialog => dialog.accept());

    await truckDriver.waitFor( 'div.modal button:enabled' );
    await truckDriver.click( 'div.modal button:enabled' );
    await truckDriver.waitFor( 10000 );


  });


}, TEST_TIMEOUT );
