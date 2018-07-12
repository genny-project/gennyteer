import { PAGE_WIDTH, PAGE_HEIGHT, TEST_TIMEOUT, JOB_ID } from 'constants';
import { Screenshot } from 'utils';
import puppeteer from  'puppeteer';

const shot = new Screenshot( 'smoke_test' );

let B_truckDriver, B_TDBrowser;

jest.setTimeout( 120000 );

describe( 'Load Posting', () => {
  beforeAll( async () => {
    const args = [
      '--no-sandbox',
      `--window-size=${ PAGE_WIDTH },${ PAGE_HEIGHT }`
    ];

    B_TDBrowser = await puppeteer.launch({
      args,
      headless: !process.env.HEADLESS
    });

    B_truckDriver = await B_TDBrowser.newPage();

    B_truckDriver.setViewport({
      width: 3500,
      height: PAGE_HEIGHT,
    });


    await B_truckDriver.goto( process.env.CHANNEL40_URL );
    await B_truckDriver.waitFor(15000);

    await expect( B_truckDriver ).toFillForm( 'body', {
      username: process.env.TRUCKDRIVER_B_USERNAME,
      password: process.env.TRUCKDRIVER_B_PASSWORD,
    }),

    await expect( B_truckDriver ).toClick( 'button', { text: 'Login' }),

    await B_truckDriver.waitFor( 'div > div > div.grid.sub-header > div > div > div > ul > li > span:nth-child(2)' ),

    await B_truckDriver.waitFor( 10000 );
  });

  afterEach( async () => {
    await shot.shoot( B_truckDriver, 'DR_B_AFTER' );
  });

  afterAll( async () => {
    await B_TDBrowser.close();
  });

  it ( 'should submit load and time the roundtrip', async () => {

    const pages = [
      {page: B_truckDriver, name: 'truckdriverB'}
    ];

    await shot.shoot( B_truckDriver, 'TD_B' );
  });

}, TEST_TIMEOUT );
