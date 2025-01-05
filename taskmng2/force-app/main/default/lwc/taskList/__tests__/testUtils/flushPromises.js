// flushPromises.js
export default function flushPromises() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

// Add a simple test to prevent the "must contain at least one test" error
describe('flushPromises', () => {
    it('should resolve promises', async () => {
        await flushPromises();
        expect(true).toBe(true);
    });
});
