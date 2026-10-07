// gates/logs-gate.js
// Avalia um arquivo de log simulado da aplicação, contando quantas linhas
// de ERROR/CRITICAL existem, e decide se o pipeline pode seguir em frente.

const fs = require('fs');

const LIMITE_ERROS = 1; // máximo de linhas de erro toleradas no log

function avaliarLogs(caminhoLog) {
  const conteudo = fs.readFileSync(caminhoLog, 'utf-8');
  const linhas = conteudo.split('\n').filter(Boolean);

  const linhasDeErro = linhas.filter(
    (linha) => linha.includes('ERROR') || linha.includes('CRITICAL')
  );

  const aprovado = linhasDeErro.length <= LIMITE_ERROS;

  return {
    nome: 'Quality Gate (Logs)',
    aprovado,
    motivo: aprovado
      ? `${linhasDeErro.length} linha(s) de erro no log — dentro do limite de ${LIMITE_ERROS}.`
      : `${linhasDeErro.length} linha(s) de ERROR/CRITICAL encontradas no log — acima do limite de ${LIMITE_ERROS}.`,
    detalhes: {
      total_linhas: linhas.length,
      linhas_de_erro: linhasDeErro,
      limite_erros: LIMITE_ERROS,
    },
  };
}

module.exports = { avaliarLogs, LIMITE_ERROS };
