// jest.config.cjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Para manejar archivos JS y TS
  },
  transformIgnorePatterns: ['/node_modules/(?!(axios)/)'], // Si es necesario
};
