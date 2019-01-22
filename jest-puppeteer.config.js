const puppeteer = require('puppeteer');
const path = require("path");


module.exports = {
	launch: {
		headless: false,
		args: [
			'--disable-extensions-except=' + path.resolve("./dist"),
			'--load-extension=' + path.resolve("./dist")
		]
	}
}
