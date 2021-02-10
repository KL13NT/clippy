/**
 * @jest-environment ./src/test/my-custom-environment
 */

describe("Sample Test", () => {
  it("Does not do much!", () => {
    expect(true).to.equal(true);
  });
});
