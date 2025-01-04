const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
    ...jestConfig,
    modulePathIgnorePatterns: ['<rootDir>/.localdevserver'],
    moduleNameMapper: {
        '^c/(.*)$': '<rootDir>/force-app/main/default/lwc/$1',
        '^testUtils/(.*)$': '<rootDir>/force-app/main/default/lwc/testUtils/$1'  // Add mapping for flushPromises
    }
};
