const path = require("path");

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "./coverage/",
  coverageReporters: ["json", "json-summary", "html", "text", "lcov"],
  collectCoverageFrom: [path.resolve(__dirname, "./src/**/*.{js,jsx}")],
  testMatch: [path.resolve(__dirname, "./__tests__/**/*.{js,jsx}")],
  testEnvironment: "node",
  moduleNameMapper: {},
};
