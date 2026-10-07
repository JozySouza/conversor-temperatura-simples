// pipeline-qualidade.js
//
// Orquestra os 4 Quality Gates do pipeline (Testes/Cobertura, Métricas,
// Logs, Traces). Simula o papel de uma etapa de "IA" que aprova ou
// bloqueia o pipeline, e que gera uma issue automaticamente quando algo
// falha.
//
// Uso:
//   node qualidade/pipeline-qualidade.js ok      -> roda o cenário saudável
//   node qualidade/pipeline-qualidade.js falha   -> roda o cenário com problemas
//
// Também disponível via npm:
//   npm run qualidade:ok
//   npm run qualidade:falha

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const { avaliarCobertura } = require('./gates/quality-gate');
const { avaliarMetricas } = require('./gates/metrics-gate');
const { avaliarLogs } = require('./gates/logs-gate');
const { avaliarTraces } = require('./gates/traces-gate');
const { gerarIssue } = require('./gerar-issue');

const RAIZ = path.join(__dirname, '..');
const cenario = process.argv[2] === 'falha' ? 'falha' : 'ok';

function linha() {
  console.log('─'.repeat(70));
}

function titulo(texto) {
  linha();
  console.log(texto);
  linha();
}

function gerarCoberturaDoProjetoPrincipal() {
  // roda o Jest do projeto principal (converter.js / converter.test.js),
  // que está 100% coberto.
  execSync(
    'npx jest --coverage --coverageReporters=json-summary --coverageDirectory=qualidade/coverage-ok --silent',
    { cwd: RAIZ, stdio: 'inherit' }
  );
  return path.join(RAIZ, 'qualidade/coverage-ok/coverage-summary.json');
}

function gerarCoberturaDoAppDemo() {
  // roda o Jest só no mini app de demonstração (qualidade/demo-cobertura-baixa),
  // com uma config isolada (jest.config.js próprio), onde a função
  // "mediaPonderada" não tem teste nenhum -> cobertura baixa de verdade.
  execSync('npx jest --config qualidade/demo-cobertura-baixa/jest.config.js --coverage --silent', {
    cwd: RAIZ,
    stdio: 'inherit',
  });
  return path.join(RAIZ, 'qualidade/demo-cobertura-baixa/coverage/coverage-summary.json');
}

function rodarPipeline() {
  titulo(`🧪 PIPELINE DE QUALIDADE — cenário: "${cenario.toUpperCase()}"`);

  console.log('\n> Etapa 1/4: rodando testes e calculando cobertura...\n');
  const caminhoCoverage =
    cenario === 'ok' ? gerarCoberturaDoProjetoPrincipal() : gerarCoberturaDoAppDemo();
  const resultadoCobertura = avaliarCobertura(caminhoCoverage);

  const caminhoMetricas = path.join(RAIZ, `qualidade/fixtures/metrics-${cenario}.json`);
  const resultadoMetricas = avaliarMetricas(caminhoMetricas);

  const caminhoLog = path.join(RAIZ, `qualidade/fixtures/app-${cenario}.log`);
  const resultadoLogs = avaliarLogs(caminhoLog);

  const caminhoTraces = path.join(RAIZ, `qualidade/fixtures/traces-${cenario}.json`);
  const resultadoTraces = avaliarTraces(caminhoTraces);

  const resultados = [resultadoCobertura, resultadoMetricas, resultadoLogs, resultadoTraces];

  console.log('\n> Etapa 2/4 a 4/4: avaliando métricas, logs e traces...\n');

  resultados.forEach((resultado, indice) => {
    const selo = resultado.aprovado ? '✅ APROVADO' : '❌ BLOQUEADO';
    console.log(`[Gate ${indice + 1}/4] ${resultado.nome}`);
    console.log(`  Decisão: ${selo}`);
    console.log(`  Motivo : ${resultado.motivo}`);
    console.log('');
  });

  const gatesComFalha = resultados.filter((resultado) => !resultado.aprovado);
  const pipelineAprovada = gatesComFalha.length === 0;

  titulo(
    pipelineAprovada
      ? '✅ RESULTADO FINAL: PIPELINE APROVADA — pode seguir para o deploy.'
      : `❌ RESULTADO FINAL: PIPELINE BLOQUEADA — ${gatesComFalha.length} gate(s) reprovado(s).`
  );

  if (!pipelineAprovada) {
    const issue = gerarIssue(gatesComFalha);
    const caminhoIssue = path.join(RAIZ, 'qualidade/issue-gerada.md');
    fs.writeFileSync(
      caminhoIssue,
      `# ${issue.titulo}\n\nLabels: ${issue.labels.join(', ')}\n\n${issue.corpo}\n`
    );

    console.log('\n🤖 IA detectou o bloqueio e abriu uma issue automaticamente:\n');
    console.log(`Título : ${issue.titulo}`);
    console.log(`Labels : ${issue.labels.join(', ')}`);
    console.log(`Arquivo: ${caminhoIssue}`);
    console.log('\nEm um repositório real, isso seria feito com:');
    console.log(
      `  gh issue create --title "${issue.titulo}" --body-file qualidade/issue-gerada.md --label ${issue.labels.join(',')}`
    );
  }

  process.exitCode = pipelineAprovada ? 0 : 1;
}

rodarPipeline();
