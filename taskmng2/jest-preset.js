module.exports = {
    preset: '@salesforce/lwc-jest',
    testEnvironment: 'jest-environment-jsdom-sixteen',
    moduleNameMapper: {
      '^c/(.*)$': '<rootDir>/force-app/main/default/lwc/$1/$1',
    },
  };
  