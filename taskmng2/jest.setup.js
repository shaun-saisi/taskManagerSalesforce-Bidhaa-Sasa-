// jest.setup.js
global.setImmediate = (callback) => {
    return process.nextTick(callback);
};
