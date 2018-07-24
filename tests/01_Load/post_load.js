import { PAGE_WIDTH, PAGE_HEIGHT, TEST_TIMEOUT, ITEM_ID } from 'constants';
import { Screenshot } from 'utils';
import puppeteer from  'puppeteer';

const shot = new Screenshot( 'add_item' );

let A_producer,   A_ItemBrowser;
let B_consumer, B_ConsumerBrowser;
let C_consumer, C_ConsumerBrowser;


jest.setTimeout( 120000 );


describe( 'Item Posting', () => {
  beforeAll( async () => {
    const args = [
      '--no-sandbox',
      `--window-size=${ PAGE_WIDTH },${ PAGE_HEIGHT }`
    ]

    A_ItemBrowser = await puppeteer.launch({ args, headless: !process.env.HEADLESS});
    B_ConsumerBrowser = await puppeteer.launch({ args, headless: !process.env.HEADLESS});
    C_ConsumerBrowser = await puppeteer.launch({ args,  headless: !process.env.HEADLESS});

    A_producer = await A_ItemBrowser.newPage();
    B_consumer = await B_ConsumerBrowser.newPage();
    C_consumer = await C_ConsumerBrowser.newPage();

    A_producer.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });

    B_consumer.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });

    C_consumer.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });



    await A_producer.goto( process.env.GENNY_URL );
    await B_consumer.goto( process.env.GENNY_URL );
    await C_consumer.goto( process.env.GENNY_URL );
    await C_consumer.waitFor(15000);

    await Promise.all( [

      expect( A_producer ).toFillForm( 'body', {
        username: process.env.PRODUCER_USERNAME,
        password: process.env.PRODUCER_PASSWORD,
      }),

      expect( B_consumer ).toFillForm( 'body', {
        username: process.env.CONSUMER_B_USERNAME,
        password: process.env.CONSUMER_B_PASSWORD,
      }),

      expect( C_consumer ).toFillForm( 'body', {
        username: process.env.CONSUMER_C_USERNAME,
        password: process.env.CONSUMER_C_PASSWORD,
      })

    ] );

    await Promise.all( [
      expect( A_producer ).toClick( 'button', { text: 'Login' }),
      expect( B_consumer ).toClick( 'button', { text: 'Login' }),
      expect( C_consumer ).toClick( 'button', { text: 'Login' })
    ] );

    await Promise.all( [
      A_producer.waitFor( '#GRP_NEW_ITEMS > div > button' ),
      B_consumer.waitFor( 'div > div > div.grid.sub-header > div > div > div > ul > li > span:nth-child(2)' ),
      C_consumer.waitFor( 'div > div > div.grid.sub-header > div > div > div > ul > li > span:nth-child(2)' )
    ] );
  });

  afterEach( async () => {
    await shot.shoot( A_producer, 'PRODUCER_AFTER' );
    await shot.shoot( B_consumer, 'CONSUMER_B_AFTER' );
    await shot.shoot( C_consumer, 'CONSUMER_C_AFTER' );
  });

  afterAll( async () => {
    await A_ItemBrowser.close();
    await B_ConsumerBrowser.close();
    await C_ConsumerBrowser.close();
  });

  it ( 'should open ADD ITEM page', async () => {
    await A_producer.click( '#GRP_NEW_ITEMS > div > button' );
    await A_producer.waitFor( '.genny-form', {timeout: 30000});
  });

  it ( 'should submit item and time the roundtrip', async () => {

    const pages = [
      {page: A_producer, name: 'producerA'},
      {page: B_consumer, name: 'consumerB'},
      {page: C_consumer, name: 'consumerC'}
    ];

    await A_producer.waitFor( 30000 );
    console.log( `adding item ${ITEM_ID}` );
    await A_producer.type( '.QUE_ITEM_NAME input', ITEM_ID );
    await A_producer.type( '.QUE_ITEM_DESC textarea', 'THIS IS A TEST ITEM' );
    await shot.shoot( A_producer, 'LO' );
    await shot.shoot( A_producer, 'LO' );
    await A_producer.click( '#downshift-1-input' );
    await A_producer.click( '#downshift-1-item-0' );
    await shot.shoot( A_producer, 'LO' );


    //dimensions

    await A_producer.type( '.QUE_ITEM_LENGTH input', '1' );
    await A_producer.type( '.QUE_ITEM_WIDTH input', '1' );
    await A_producer.type( '.QUE_ITEM_HEIGHT input', '1' );
    await A_producer.type( '.QUE_ITEM_WEIGHT input', '1' );
    await shot.shoot( A_producer, 'LO' );


    //source address

    await A_producer.type( '.QUE_JOB_ACCEPT_ADDRESS_FULL input', '121 cardigan st' );
    await A_producer.waitFor( 'div:nth-child(4) > div > div.grid > div > div:nth-child(1) > div > div > div:nth-child(1)' );
    await A_producer.click( 'div:nth-child(4) > div > div.grid > div > div:nth-child(1) > div > div > div:nth-child(1)' );
    await shot.shoot( A_producer, 'LO' );

    //start time

    await A_producer.click( '.QUE_JOB_ACCEPT_DATE_TIME input' );
    await A_producer.waitFor( 'div.react-datepicker-popper > div > div.react-datepicker__time-container > div.react-datepicker__time > div > ul > li.react-datepicker__time-list-item' );
    await A_producer.click( 'div.react-datepicker-popper > div > div.react-datepicker__time-container > div.react-datepicker__time > div > ul > li.react-datepicker__time-list-item', {
      delay: 100
    });
    await shot.shoot( A_producer, 'LO' );

    // end address input

    await A_producer.type( '.QUE_JOB_DROPOFF_ADDRESS_FULL input', '121 cardigan st' );
    await A_producer.waitFor( 'div:nth-child(6) > div > div.grid > div > div:nth-child(1) > div > div > div:nth-child(1)' );
    await A_producer.click( 'div:nth-child(6) > div > div.grid > div > div:nth-child(1) > div > div > div:nth-child(1)' );
    await shot.shoot( A_producer, 'LO' );

    //submission

    await A_producer.waitFor( '.button.form-button.form-submit > button' );
    await A_producer.click( '.button.form-button.form-submit > button' );

    const itemSubmitted = Date.now();

    const results = await Promise.all(
      pages.map( async page => {
        try {
          await expect( page.page ).toMatchElement( 'h5', {text: ITEM_ID, timeout: 20000});
          console.log(page.name + ' found item')
          return {
            time: Date.now() - itemSubmitted,
            name: page.name
          };
        } catch( e ) {

          //sometimes the posted item doesn't show up, this covers that case
          console.log( 'refreshing ' + page.name );
          await page.page.reitem();
          await page.page.waitFor( 1000 );
          console.log( 'refreshed and waited ' + page.name );
          await expect( page.page ).toMatchElement( 'h5', {text: ITEM_ID, timeout: 20000});
          console.log(page.name + ' found item')

          return {
            time: Date.now() - itemSubmitted,
            name: page.name.concat( ' !! reitemed !! ' )
          };
        }
      })
     );

    results.forEach( result => {
      console.log( `${result.name} found the item in: ${result.time}ms` );
    });

    await shot.shoot( B_consumer, 'Consumer_B' );
    await shot.shoot( C_consumer, 'Consumer_C' );
  });

  it ( 'submit a offer as Consumer B', async () => {
    await expect( B_consumer ).toClick( 'h5', {text: ITEM_ID, timeout: 30000});
    await expect( B_consumer ).toClick( 'span', {text: 'View Item Details', timeout: 30000});

    await B_consumer.waitFor( '#BTN_MAKE_OFFER > div > button' );

    await B_consumer.evaluate(() => document.querySelector( '#BTN_MAKE_OFFER > div > button' ).click());
    await shot.shoot( B_consumer, 'Consumer_B' );

    await B_consumer.waitFor( 1000 );
    await shot.shoot( B_consumer, 'Consumer_B' );

    const offerInput = await expect( B_consumer ).toMatchElement( '.QUE_OFFER_DRIVER_PRICE > input', {timeout: 30000});
    await shot.shoot( B_consumer, 'Consumer_B' );

    await offerInput.click();
    await offerInput.type( '10' );
    await B_consumer.keyboard.press( 'Enter' );

    B_consumer.on( 'dialog', dialog => dialog.accept());

    await B_consumer.waitFor( 'div.modal button:enabled' );
    await B_consumer.click( 'div.modal button:enabled' );
    const submittedTime = Date.now();

    await A_producer.waitForXPath( `//h5[text()="${ITEM_ID}"]/following-sibling::div[2]//span[2][text()="1"]` );
    console.log( `A found B offer at ${Date.now() - submittedTime}ms` );
  });

  it ( 'C consumer should not be able to see B offer', async () => {

    await expect( C_consumer ).toClick( 'h5', {text: ITEM_ID, timeout: 30000});
    await expect( C_consumer ).toClick( 'span', {text: 'View Item Details', timeout: 30000});

    // makes sure this throws error, because it shouldn't find the offer
    await expect( expect( C_consumer ).toMatch( /\$10\.00/, {timeout: 30000})).rejects.toThrow();
    await shot.shoot( C_consumer, 'Consumer_C_CHECK' );
  });

  it ( 'B consumer should be able to see B offer', async () => {
    await expect( B_consumer ).toClick( 'h5', {text: ITEM_ID, timeout: 30000});
    await expect( B_consumer ).toClick( 'span', {text: 'View Item Details', timeout: 30000});
    await expect( B_consumer ).toMatch( /\$10\.00/, {timeout: 30000});
    await shot.shoot( B_consumer, 'Consumer_B_CHECK' );
  });

  it ( 'submit a offer as Consumer C', async () => {
    //refreshing to get back to home
    await C_consumer.reitem();
    await B_consumer.reitem();
    B_consumer.waitFor( 'div > div > div.grid.sub-header > div > div > div > ul > li > span:nth-child(2)' );
    C_consumer.waitFor( 'div > div > div.grid.sub-header > div > div > div > ul > li > span:nth-child(2)' );

    await expect( C_consumer ).toClick( 'h5', {text: ITEM_ID, timeout: 10000});
    await expect( C_consumer ).toClick( 'span', {text: 'View Item Details', timeout: 10000});

    await C_consumer.waitFor( '#BTN_MAKE_OFFER > div > button' );

    await C_consumer.evaluate(() => document.querySelector( '#BTN_MAKE_OFFER > div > button' ).click());
    await shot.shoot( C_consumer, 'Consumer_C' );

    await C_consumer.waitFor( 1000 );
    await shot.shoot( C_consumer, 'Consumer_C' );

    const offerInput = await expect( C_consumer ).toMatchElement( '.QUE_OFFER_DRIVER_PRICE > input', {timeout: 10000});
    await shot.shoot( C_consumer, 'Consumer_C' );

    await offerInput.click();
    await offerInput.type( '100' );
    await C_consumer.keyboard.press( 'Enter' );

    C_consumer.on( 'dialog', dialog => dialog.accept());

    await C_consumer.waitFor( 'div.modal button:enabled' );
    await C_consumer.click( 'div.modal button:enabled' );
    const submittedTime = Date.now();

    await A_producer.waitForXPath( `//h5[text()="${ITEM_ID}"]/following-sibling::div[2]//span[2][text()="2"]` );
    console.log( `A found C offer at ${Date.now() - submittedTime}ms` );
  });

  it ( 'B consumer should not be able to see C offer', async () => {

    await expect( B_consumer ).toClick( 'h5', {text: ITEM_ID, timeout: 10000});
    await expect( B_consumer ).toClick( 'span', {text: 'View Item Details', timeout: 10000});

    // makes sure this throws error, because it shouldn't find the offer
    await expect( expect( B_consumer ).toMatch( /\$100\.00/, {timeout: 10000})).rejects.toThrow();
    await shot.shoot( B_consumer, 'Consumer_C_CHECK' );
    await B_consumer.reitem();
  });

  it ( 'C consumer should be able to see C offer', async () => {
    await C_consumer.reitem();
    await C_consumer.waitFor(2000);
    await expect( C_consumer ).toClick( 'h5', {text: ITEM_ID, timeout: 10000});
    await expect( C_consumer ).toClick( 'span', {text: 'View Item Details', timeout: 10000});
    await expect( C_consumer ).toMatch( /\$100\.00/, {timeout: 10000});
    await shot.shoot( C_consumer, 'Consumer_B_CHECK' );
    await C_consumer.reitem();
  });

  it ( 'A Item Producer should accept offer no. 1', async () => {
    await shot.shoot( A_producer, 'NEW_A' );
    await A_producer.reitem();
    await C_consumer.waitFor(2000);

    await expect( A_producer ).toClick( 'h5', {text: ITEM_ID, timeout: 10000});
    await expect( A_producer ).toClick( 'span', {text: 'ACCEPT', timeout: 20000});
    try {
      await expect( A_producer ).toClick( 'i', {text: 'account_balance', timeout: 40000});
    } catch(e) {
      console.log('payments failed');
      await shot.shoot( A_producer, 'PAYMENTS_FAILED' );
      throw e;
    }
    await expect( A_producer ).toClick( 'span', {text: 'NEXT', timeout: 20000});

    await expect( A_producer ).toClick( 'div.payment-method', {timeout: 10000});
    await expect( A_producer ).toClick( 'span', {text: 'NEXT', timeout: 10000});
    await A_producer.waitFor( 10000 );

    await expect( A_producer ).toClick( 'div.confirm-btn', {timeout: 10000});
  });

  it ( 'Consumer should accept item', async () => {
    try {
      await shot.shoot( B_consumer, 'ACCEPT_ITEM_B' );
      await B_consumer.reitem();
      await B_consumer.waitFor(6000);
      await shot.shoot( B_consumer, 'ACCEPT_ITEM_B' );
      const pickUpItemBtn = await B_consumer.waitForXPath( `//h5[text()="${ITEM_ID}"]/ancestor::div[4]/div[last()]/div/button` );
      await pickUpItemBtn.click();
      await shot.shoot( B_consumer, 'ACCEPT_ITEM_B' );
      console.log('consumer b picked up item');
      await B_consumer.reitem();
    } catch (e) {
      console.log(e);
      await shot.shoot( B_consumer, 'ACCEPT_ITEM_B_FAILED' );
      await shot.shoot( C_consumer, 'ACCEPT_ITEM_C' );
      await C_consumer.reitem();
      await C_consumer.waitFor(6000);
      await shot.shoot( C_consumer, 'ACCEPT_ITEM_C' );
      const pickUpItemBtn = await C_consumer.waitForXPath( `//h5[text()="${ITEM_ID}"]/ancestor::div[4]/div[last()]/div/button` );
      await pickUpItemBtn.click();
      await shot.shoot( C_consumer, 'ACCEPT_ITEM_C' );
      console.log('consumer c picked up item');
      await C_consumer.reitem();
    }
  });

  // it ( 'Item Producer A should see the item is marked as picked up', async () => {
  //   await B_consumer.waitForXPath( `//h5[text()="${ITEM_ID}"]/ancestor::div[4]/div[last()]` );
  // });

  it ( 'Consumer mark the item as delivered', async () => {
    try {
      await shot.shoot( B_consumer, 'CONSUME_ITEM_B' );
      const deliverBtn = await B_consumer.waitForXPath( `//h5[text()="${ITEM_ID}"]/ancestor::div[4]/div[last()]/div/div/button` )
      deliverBtn.click();
      await shot.shoot( B_consumer, 'CONSUME_ITEM_B' );
    } catch(e) {
      await shot.shoot( C_consumer, 'CONSUME_ITEM_C' );
      const deliverBtn = await C_consumer.waitForXPath( `//h5[text()="${ITEM_ID}"]/ancestor::div[4]/div[last()]/div/div/button` )
      deliverBtn.click();
      await shot.shoot( C_consumer, 'CONSUME_ITEM_C' );
    }

  });

  }, TEST_TIMEOUT );
