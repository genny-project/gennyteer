import { PAGE_WIDTH, PAGE_HEIGHT, TEST_TIMEOUT} from 'constants';
import { Screenshot } from 'utils';


jest.setTimeout( 60000 );

describe( 'Smoke Tests', () => {
  beforeAll( async () => {
    page.setViewport({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT
    });
    await page.goto( process.env.CHANNEL40_URL );
  });

  it( 'Should redirect to Keycloak', async () => {
    expect( await page.url()).toContain( 'auth' );
  });

  it( 'Should log in to Genny', async () => {
    await expect( page ).toFillForm( 'body', {
      username: 'user1',
      password: 'password1',
    });

    await expect( page ).toClick( 'button', { text: 'Login' });
  });

  it( 'Should show bucket view', async () => {
    await page.waitFor( 'div > div > div.grid.sub-header > div > div > div > ul > li > span:nth-child(2)', {timeout: 15000});
  });

}, TEST_TIMEOUT );
    