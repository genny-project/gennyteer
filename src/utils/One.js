import puppeteer from 'puppeteer';
import dateFns from 'date-fns';


const PAGE_WIDTH= 500;
const PAGE_HEIGHT=500;
class One {
  constructor( headless=false, PAGE_HEIGHT= 800,PAGE_WIDTH=800){
  this.page =  this.generatePage();
  }

  getGage(){
    return this.page();
  }

  describe(str){
    const date = dateFns.format(new Date(), 'MM/DD/YYYY');
    if(!str){
      console.log("!! Warning. Describe Method Not provided but not necessary ");
    }
    else { 
      console.log(date, str);
    }
  }


 async generatePage () {
  let browser;
  const args = ['--no-sandbox', `--window-size=${PAGE_WIDTH},${PAGE_HEIGHT}`];
  browser = await puppeteer.launch({
    args,
    headless: false
  });

  let page = await browser.newPage();

  await page.setViewport({
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT
  });

  return page;
};

  async run(cb){
    const page = await this.page;
    expect.hasAssertions();
    cb();
  }
}


export default One;