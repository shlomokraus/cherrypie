import config from "config";

const OUTPUT_DIR = "./test/puppeteer"

const SELECTED_FILENAME = "file2.js";
const MAIN_SLICE_BTN_WRAPPER = ".cherry-pie-toolbar";
const MAIN_SLICE_BTN = `${MAIN_SLICE_BTN_WRAPPER} button`;
const MAIN_SLICE_BTN_COUNT_LABEL = `${MAIN_SLICE_BTN} span`;
const SLICE_BTN = ".cherry-action a";
const LOGIN_PAGE = ".cherry-login-page";
const USERNAME_INPUT = `${LOGIN_PAGE} [name=username]`;
const PASSWORD_INPUT = `${LOGIN_PAGE} [name=password]`;
const LOGIN_SUBMIT = `${LOGIN_PAGE} [type=submit]`;
const FILES_PAGE = ".cherry-files-page";
const FILE_ITEM = ".cherry-file-list-item";
const FILE_ITEM_FILENAME = `${FILE_ITEM} .file-name`;
const FILE_ITEM_REMOVE = `${FILE_ITEM} .remove-file`;
describe('Cherry Pie Live', () => {
  beforeAll(async () => {
    return page.goto(config.get("test.live.url"));
  });


  it('should load the extension', async () => {
    const btn = await page.$(MAIN_SLICE_BTN_WRAPPER);
    expect(btn).toBeDefined()
  });


  it("should have the main button hidden", async () => {
    const btn = await page.$(MAIN_SLICE_BTN);
    expect(btn).toEqual(null)
  })

  it('should have at least one visible Slice btn', async () => {
    const btn = await page.$(SLICE_BTN);
    const text = await page.evaluate(element => element.textContent, btn);
    expect(text).toEqual("Slice")
  });

  it('clicking the slice btn will increment the slice count and show main button', async () => {
    await page.click(SLICE_BTN);
    const btn = await page.waitForSelector(MAIN_SLICE_BTN_COUNT_LABEL);
    const text = await page.evaluate(element => element.textContent, btn);
     expect(text).toEqual("1")

  });

  it('clicking the main button will show login box', async () => {
    await page.click(MAIN_SLICE_BTN);
    await page.waitForSelector(LOGIN_PAGE);
    await page.screenshot({path: OUTPUT_DIR+"/login.png"});
  });

  it('login with username and password should direct to files page', async () => {
    await page.type(USERNAME_INPUT, config.get("github.username"));
    await page.type(PASSWORD_INPUT, config.get("github.password"));
    await page.click(LOGIN_SUBMIT);
    await page.waitFor(2000);
    await page.screenshot({path:OUTPUT_DIR+"login-submit.png"});

    await page.waitForSelector(FILES_PAGE);
  },10000);

  it('should have our selected file listed', async () => {
    await page.screenshot({path: OUTPUT_DIR+"files.png"});

    const item = await page.$(FILE_ITEM_FILENAME);
    const text = await page.evaluate(element => element.textContent, item);

    expect(text).toEqual(SELECTED_FILENAME);
  })

  it('clicking trash icon should remove the file', async () => {
    await page.screenshot({path: OUTPUT_DIR+"files.png"});
    await page.click(FILE_ITEM_REMOVE);
    await page.waitFor(100);
    const item = await page.$(FILE_ITEM_FILENAME);
    await page.screenshot({path: OUTPUT_DIR+"files-remove.png"});

    expect(item).toEqual(null);
  })
});