// gates/metrics-gate.js
// Avalia métricas simuladas da aplicação (tempo de resposta, taxa de erro, uso de CPU)
// e decide se o pipeline pode seguir em frente.

const fs = require('fs');

const LIMITES = {
  tempo_resposta_ms: 300,
  taxa_erro_pct: 5,
  cpu_pct: 80,
};

function avaliarMetricas(caminhoMetricas) {
  const metricas = JSON.parse(fs.readFileSync(caminhoMetricas, 'utf-8'));

  const problemas = [];

  if (metricas.tempo_resposta_ms > LIMITES.tempo_resposta_ms) {
    problemas.push(
      `tempo de resposta de ${metricas.tempo_resposta_ms}ms acima do limite de ${LIMITES.tempo_resposta_ms}ms`
    );
  }
  if (metricas.taxa_erro_pct > LIMITES.taxa_erro_pct) {
    problemas.push(
      `taxa de erro de ${metricas.taxa_erro_pct}% acima do limite de ${LIMITES.taxa_erro_pct}%`
    );
  }
  if (metricas.cpu_pct > LIMITES.cpu_pct) {
    problemas.push(`uso de CPU de ${metricas.cpu_pct}% acima do limite de ${LIMITES.cpu_pct}%`);
  }

  const aprovado = problemas.length === 0;

  return {
    nome: 'Quality Gate (Métricas)',
    aprovado,
    motivo: aprovado
      ? 'Todas as métricas (tempo de resposta, taxa de erro, CPU) estão dentro do esperado.'
      : `Métricas fora do padrão: ${problemas.join('; ')}.`,
    detalhes: { ...metricas, limites: LIMITES },
  };
}

module.exports = { avaliarMetricas, LIMITES };
