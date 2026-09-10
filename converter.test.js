const { celsiusParaFahrenheit, fahrenheitParaCelsius } = require('./converter');

// --- Testes de ACERTO (comportamento correto) ---

test('0°C deve virar 32°F', () => {
  expect(celsiusParaFahrenheit(0)).toBe(32);
});

test('100°C deve virar 212°F', () => {
  expect(celsiusParaFahrenheit(100)).toBe(212);
});

// Teste sugerido pela IA depois de revisar a suíte (ver AI_REVIEW.md)
test('-10°C deve virar 14°F', () => {
  expect(celsiusParaFahrenheit(-10)).toBe(14);
});

test('32°F deve virar 0°C', () => {
  expect(fahrenheitParaCelsius(32)).toBe(0);
});

// --- Testes de ERRO (entrada inválida) ---

test('deve dar erro se o valor não for um número', () => {
  expect(() => celsiusParaFahrenheit('abc')).toThrow();
});

test('deve dar erro se o valor for undefined', () => {
  expect(() => fahrenheitParaCelsius(undefined)).toThrow();
});
