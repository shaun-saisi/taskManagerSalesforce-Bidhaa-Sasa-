export const flushPromises = () => new Promise((resolve) => process.nextTick(resolve));
