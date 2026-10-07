// Config isolada (não herda o testPathIgnorePatterns do projeto principal),
// usada só para gerar coverage deste mini app de demonstração.
module.exports = {
  rootDir: '.',
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['calc.js'],
  coverageReporters: ['json-summary'],
  coverageDirectory: 'coverage',
};
