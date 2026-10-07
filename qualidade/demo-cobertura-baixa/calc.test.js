// Propositalmente só testamos "somar". A função "mediaPonderada" fica
// sem nenhum teste, para a cobertura ficar abaixo do limite (80%) e o
// Quality Gate bloquear o pipeline nesta demonstração.

const { somar } = require('./calc');

test('somar(2, 3) deve ser 5', () => {
  expect(somar(2, 3)).toBe(5);
});
