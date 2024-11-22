export const testEnvironment = 'jsdom';
export const setupFilesAfterEnv = ['<rootDir>/jest.setup.js'];
export const testMatch = [
  '**/__tests__/**/*.js?(x)',
  '**/?(*.)+(spec|test).js?(x)',
];
export const moduleNameMapper = {
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js', // Mock static files
};
