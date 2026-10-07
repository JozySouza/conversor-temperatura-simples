// gates/quality-gate.js
// Avalia a cobertura de testes (gerada pelo Jest em coverage/coverage-summary.json)
// e decide se o pipeline pode seguir em frente.

const fs = require('fs');

const LIMITE_COBERTURA = 80; // em porcentagem

function avaliarCobertura(caminhoCoverageSummary) {
  if (!fs.existsSync(caminhoCoverageSummary)) {
    return {
      nome: 'Quality Gate (Testes/Cobertura)',
      aprovado: false,
      motivo: `Não encontrei o relatório de cobertura em "${caminhoCoverageSummary}". Rode "npm test" antes.`,
      detalhes: {},
    };
  }

  const resumo = JSON.parse(fs.readFileSync(caminhoCoverageSummary, 'utf-8'));
  const total = resumo.total;

  const percentualLinhas = total.lines.pct;
  const percentualFuncoes = total.functions.pct;
  const percentualBranches = total.branches.pct;

  const aprovado = percentualLinhas >= LIMITE_COBERTURA;

  return {
    nome: 'Quality Gate (Testes/Cobertura)',
    aprovado,
    motivo: aprovado
      ? `Cobertura de linhas (${percentualLinhas}%) está acima do limite mínimo (${LIMITE_COBERTURA}%).`
      : `Cobertura de linhas (${percentualLinhas}%) está ABAIXO do limite mínimo (${LIMITE_COBERTURA}%). Existem trechos de código sem nenhum teste cobrindo.`,
    detalhes: {
      cobertura_linhas_pct: percentualLinhas,
      cobertura_funcoes_pct: percentualFuncoes,
      cobertura_branches_pct: percentualBranches,
      limite_minimo_pct: LIMITE_COBERTURA,
    },
  };
}

module.exports = { avaliarCobertura, LIMITE_COBERTURA };
