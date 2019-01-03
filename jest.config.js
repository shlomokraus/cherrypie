module.exports = {
    testEnvironment: "jsdom",
  rootDir: ".",
  verbose: false, 
  globals: {
    "ts-jest": {
      tsConfigFile: "tsconfig.json"
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
