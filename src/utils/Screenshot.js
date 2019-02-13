import mkdirp from 'mkdirp-promise';

export class Screenshot {
  constructor( page, name ) {
    this.page = page;
    this.name = name;
    this.count = 0;
  }

  async shoot( fileName ) {
    await mkdirp( `screenshots/${this.name}` );
    await this.page.screenshot({
      path: `screenshots/${this.name}/${this.count++}_${fileName}.png`
    });
  }
}
