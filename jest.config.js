module.exports = {
    testEnvironment: "jsdom",
  rootDir: ".",
  verbose: true, 
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
      diagnostics: {
        warnOnly: true
      }
    }
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "js", "tsx", "jsx"],
  collectCoverage: true,
  coverageReporters: ["lcov", "json"],
  coveragePathIgnorePatterns: ["/node_modules/", "/test/", "/dist/"],
  modulePathIgnorePatterns: ["/cloned/"],
  testEnvironment: "node"
};
  