// import mkdirp from 'mkdirp-promise';
import path from 'path';
const fs = require( 'fs-extra' );

const dir = path.resolve( __dirname, '/tmp' );
console.log({ dir });
fs.ensureDirSync( dir );

class Screenshot {
  constructor( page, name ) {
    this.page = page;
    this.name = name;
    this.count = 0;
  }

  async shoot() {
    try {
      await this.page.screenshot({
        path: `./${this.name + Date.now()}.png`
      });
    } catch ( err ) {
      console.error( err );
      throw Error( ' Error while creating file' );
    }
  }
}

export default Screenshot;
