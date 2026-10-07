// calc.js (DEMO)
// App pequeno e separado do projeto principal, criado só para demonstrar
// um Quality Gate de cobertura sendo BLOQUEADO de verdade: a função
// "mediaPonderada" abaixo não tem nenhum teste cobrindo ela.

function somar(a, b) {
  return a + b;
}

function mediaPonderada(valores, pesos) {
  let somaValores = 0;
  let somaPesos = 0;
  for (let i = 0; i < valores.length; i += 1) {
    somaValores += valores[i] * pesos[i];
    somaPesos += pesos[i];
  }
  if (somaPesos === 0) {
    throw new Error('Soma dos pesos não pode ser zero.');
  }
  return somaValores / somaPesos;
}

module.exports = { somar, mediaPonderada };
