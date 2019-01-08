import puppeteer from 'puppeteer';

class One {
  constructor( headless=false, PAGE_HEIGHT= 800,PAGE_WIDTH=800){

  }

 async generatePage () {
  let browser;
  const args = ['--no-sandbox', `--window-size=${PAGE_WIDTH},${PAGE_HEIGHT}`];
  browser = await puppeteer.launch({
    args,
    headless: headless
  });

  let page = await browser.newPage();

  await page.setViewport({
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT
  });

  return page;
};

  run(){
    const page = this.generatePage();
  }

}


export default One;