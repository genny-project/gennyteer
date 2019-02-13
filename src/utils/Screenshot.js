import mkdirp from 'mkdirp-promise';

class Screenshot {
  constructor( page, name ) {
    this.page = page;
    this.name = name;
    this.count = 0;
  }

  async shoot() {
    try {
      await mkdirp( `screenshots/${this.name}` );
      await this.page.screenshot({
        path: `screenshots/${this.name}/${this.count++}_${this.name}.png`
      });
    } catch ( err ) {
      console.log( err );
      throw new Error( ' Error while creating file' );
    }
  }
}

export default Screenshot;
