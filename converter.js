// converter.js
// Funções simples de conversão de temperatura.
// Funciona tanto no navegador (via <script>) quanto no Node.js (via require).

function celsiusParaFahrenheit(celsius) {
  if (typeof celsius !== 'number' || Number.isNaN(celsius)) {
    throw new Error('Informe um número válido em Celsius.');
  }
  return (celsius * 9) / 5 + 32;
}

function fahrenheitParaCelsius(fahrenheit) {
  if (typeof fahrenheit !== 'number' || Number.isNaN(fahrenheit)) {
    throw new Error('Informe um número válido em Fahrenheit.');
  }
  return ((fahrenheit - 32) * 5) / 9;
}

// Disponibiliza as funções para o Node (Jest) e para o navegador (window)
if (typeof module !== 'undefined') {
  module.exports = { celsiusParaFahrenheit, fahrenheitParaCelsius };
}
