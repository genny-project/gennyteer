import { PAGE_WIDTH, PAGE_HEIGHT, TEST_TIMEOUT, JOB_ID } from 'constants';
import { Screenshot } from 'utils';
import puppeteer from  'puppeteer';

const shot = new Screenshot( 'smoke_test' );

let B_consumer, B_ConsumerBrowser;

jest.setTimeout( 120000 );

describe( 'Load Posting', () => {
  beforeAll( async () => {
    const args = [
      '--no-sandbox',
      `--window-size=${ PAGE_WIDTH },${ PAGE_HEIGHT }`
    ];

    B_ConsumerBrowser = await puppeteer.launch({
      args,
      headless: !process.env.HEADLESS
    });

    B_consumer = await B_ConsumerBrowser.newPage();

    B_consumer.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });


    await B_consumer.goto( process.env.GENNY_URL );
    await B_consumer.waitFor(15000);

    await expect( B_consumer ).toFillForm( 'body', {
      username: process.env.CONSUMER_B_USERNAME,
      password: process.env.CONSUMER_B_PASSWORD,
    }),

    await expect( B_consumer ).toClick( 'button', { text: 'Login' }),

    await B_consumer.waitFor( 'div > div > div.grid.sub-header > div > div > div > ul > li > span:nth-child(2)' ),

    await B_consumer.waitFor( 10000 );
  });

  afterEach( async () => {
    await shot.shoot( B_consumer, 'Consumer_B_AFTER' );
  });

  afterAll( async () => {
    await B_ConsumerBrowser.close();
  });

  it ( 'should post item and time the roundtrip', async () => {

    const pages = [
      {page: B_consumer, name: 'consumerB'}
    ];

    await shot.shoot( B_consumer, 'Consumer_B' );
  });

}, TEST_TIMEOUT );
