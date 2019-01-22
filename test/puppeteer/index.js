const puppeteer = require('puppeteer');
const path = require("path");

(async () => {
  const options = {
    headless: false,
    args: [
      '--disable-extensions-except='+path.resolve("./dist"),
      '--load-extension='+path.resolve("./dist"),
    ]
  }
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto('https://github.com/shlomokraus/cherrypie/pull/11/files');
  await page.screenshot({path: 'example.png'});
 
  await browser.close();
})();