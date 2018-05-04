import mkdirp from 'mkdirp-promise';

export class Screenshot {
  constructor( name ) {
    this.name = name;
    this.count = 0;
  }

  async shoot( page, id ) {
    await mkdirp( `screenshots/${this.name}` );
    await page.screenshot({path: `screenshots/${this.name}/${this.count++}_${id}.png`});
  }
}