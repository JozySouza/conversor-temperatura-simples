// gates/traces-gate.js
// Avalia um trace simulado (soma da duração dos "spans" de uma requisição)
// e decide se o pipeline pode seguir em frente.

const fs = require('fs');

const LIMITE_LATENCIA_TOTAL_MS = 800;

function avaliarTraces(caminhoTraces) {
  const trace = JSON.parse(fs.readFileSync(caminhoTraces, 'utf-8'));
  const spans = trace.spans || [];

  const latenciaTotal = spans.reduce((soma, span) => soma + span.duracao_ms, 0);
  const spanMaisLento = spans.reduce(
    (maisLento, span) => (span.duracao_ms > (maisLento?.duracao_ms || 0) ? span : maisLento),
    null
  );

  const aprovado = latenciaTotal <= LIMITE_LATENCIA_TOTAL_MS;

  return {
    nome: 'Quality Gate (Traces)',
    aprovado,
    motivo: aprovado
      ? `Latência total do trace (${latenciaTotal}ms) está dentro do limite de ${LIMITE_LATENCIA_TOTAL_MS}ms.`
      : `Latência total do trace (${latenciaTotal}ms) ULTRAPASSA o limite de ${LIMITE_LATENCIA_TOTAL_MS}ms. Gargalo no serviço "${spanMaisLento?.servico}" (${spanMaisLento?.duracao_ms}ms).`,
    detalhes: {
      latencia_total_ms: latenciaTotal,
      span_mais_lento: spanMaisLento,
      limite_ms: LIMITE_LATENCIA_TOTAL_MS,
      spans,
    },
  };
}

module.exports = { avaliarTraces, LIMITE_LATENCIA_TOTAL_MS };
