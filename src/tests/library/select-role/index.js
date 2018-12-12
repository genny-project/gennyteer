import { PAGE_WIDTH, PAGE_HEIGHT } from 'constants';

class SelectRole {
  run(page) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('filling in mobile number');

        await expect(page).toFill(
          'input[data-testid~="QUE_MOBILE"]',
          process.env.INTERN_A_MOBILE
        );

        console.log('filled in mobile number');
        await page.waitFor(20 * 1000);
        resolve(true);
      } 
      catch (error) {
        reject(error);
      }
    });
  }
}

export default SelectRole;
