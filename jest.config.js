module.exports = {
  clearMocks: true,
  coverageDirectory: "./docs/coverage",
  testEnvironment: "node",
  moduleNameMapper: {},
  coverageReporters: ["json-summary", "html", "text", "lcov"],
  testMatch: ["./__tests__/**/*.test.js"],
};
