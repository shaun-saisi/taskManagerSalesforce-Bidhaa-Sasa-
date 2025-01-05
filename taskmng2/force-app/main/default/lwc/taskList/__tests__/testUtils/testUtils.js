// Utility function to flush pending promises
export const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

// Basic test to ensure the file contains valid test cases
describe('flushPromises', () => {
  it('should resolve pending promises', async () => {
    let value = false;

    // Schedule a promise to resolve
    Promise.resolve().then(() => {
      value = true;
    });

    // Wait for all pending promises to resolve
    await flushPromises();

    // Assert that the promise has resolved
    expect(value).toBe(true);
  });
});
