const base = require("./jest.config.js");

module.exports = Object.assign(base, {
	testRegex: "(/__tests__/.*|(\\.|/)(live))\\.(js?|ts?)$",
	globalSetup: "jest-environment-puppeteer/setup",
	globalTeardown: "jest-environment-puppeteer/teardown",
	testEnvironment: "jest-environment-puppeteer"
});
