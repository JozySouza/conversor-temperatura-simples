// gerar-issue.js
// Quando algum Quality Gate bloqueia o pipeline, este módulo monta o
// conteúdo de uma issue (título + corpo em Markdown + labels), do jeito
// que seria enviado para a API do GitHub (gh issue create / REST API).

function gerarIssue(gatesComFalha) {
  const titulo = `🚨 Pipeline bloqueado: ${gatesComFalha.length} verificação(ões) de qualidade falharam`;

  const corpo = [
    '## Resumo gerado automaticamente pela IA do pipeline',
    '',
    'O pipeline de CI bloqueou esta execução porque um ou mais Quality Gates',
    'não passaram. Segue o detalhamento de cada verificação, com a causa',
    'provável e uma sugestão de correção.',
    '',
    ...gatesComFalha.flatMap((gate) => [
      `### ❌ ${gate.nome}`,
      `- **Motivo:** ${gate.motivo}`,
      `- **Sugestão da IA:** ${sugestaoParaGate(gate)}`,
      '',
    ]),
    '---',
    `*Issue gerada automaticamente em ${new Date().toISOString()}*`,
  ].join('\n');

  const labels = ['pipeline-bloqueado', 'quality-gate', 'gerado-por-ia'];

  return { titulo, corpo, labels };
}

// Pequeno "motor de sugestões" que simula o papel da IA explicando a causa
// e recomendando uma correção para cada tipo de gate.
function sugestaoParaGate(gate) {
  if (gate.nome.includes('Cobertura')) {
    return 'Adicione testes para os trechos de código ainda não cobertos antes de liberar o merge.';
  }
  if (gate.nome.includes('Métricas')) {
    return 'Investigue o serviço quanto a lentidão/erros antes do deploy; considere reverter a última alteração.';
  }
  if (gate.nome.includes('Logs')) {
    return 'Verifique os logs de ERROR/CRITICAL listados abaixo e corrija a causa raiz antes de prosseguir.';
  }
  if (gate.nome.includes('Traces')) {
    return 'Otimize ou escale o serviço identificado como gargalo na latência.';
  }
  return 'Revise manualmente este item antes de liberar o pipeline.';
}

module.exports = { gerarIssue };
