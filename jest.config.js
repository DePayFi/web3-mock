module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '.git', '/playwright/'],
  setupFiles: ['./tests/setup.js'],
  automock: false,
  modulePaths: ['<rootDir>'],
  transformIgnorePatterns: [
    "/node_modules/rpc-websockets/dist/lib/server"
  ]
};
