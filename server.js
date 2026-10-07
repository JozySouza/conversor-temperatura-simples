// server.js
// Servidor bem simples (só módulos nativos do Node, sem dependências).
// Serve a página do conversor e uma API, para o pipeline de deploy poder
// subir duas versões (estável e nova) em portas diferentes e medi-las.
//
// Uso: env PORT=8001 node server.js   (ou: env PORT=8001 npm start)
//
// Rotas:
//   GET /health                                  -> {"status":"ok"}
//   GET /api/converter?valor=25&direcao=c-para-f -> {"valor":25,"resultado":77,...}
//   GET /, /style.css, /converter.js             -> arquivos da página

const http = require('http');
const fs = require('fs');
const path = require('path');
const { celsiusParaFahrenheit, fahrenheitParaCelsius } = require('./converter');

// Só estes arquivos podem ser servidos (evita acesso a outros arquivos do projeto)
const ARQUIVOS = {
  '/': { arquivo: 'index.html', tipo: 'text/html; charset=utf-8' },
  '/index.html': { arquivo: 'index.html', tipo: 'text/html; charset=utf-8' },
  '/style.css': { arquivo: 'style.css', tipo: 'text/css; charset=utf-8' },
  '/converter.js': { arquivo: 'converter.js', tipo: 'text/javascript; charset=utf-8' },
};

// Trecho E (Aula 4): simula uma versão que fica mais lenta a cada requisição.
// Só age quando a variável de ambiente SIMULAR_LENTIDAO=1.
let contador = 0;
async function simularLentidao() {
  if (process.env.SIMULAR_LENTIDAO === '1') {
    contador++;
    await new Promise((r) => setTimeout(r, 40 + 3 * contador)); // +3 ms por requisição
  }
}

function responderJson(res, status, dados) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(dados));
}

async function tratarRequisicao(req, res) {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/health') {
    return responderJson(res, 200, { status: 'ok' });
  }

  // Rota principal do sistema
  if (url.pathname === '/api/converter') {
    await simularLentidao();
    const valor = Number(url.searchParams.get('valor'));
    const direcao = url.searchParams.get('direcao') || 'c-para-f';
    try {
      const resultado =
        direcao === 'f-para-c' ? fahrenheitParaCelsius(valor) : celsiusParaFahrenheit(valor);
      return responderJson(res, 200, { valor, direcao, resultado });
    } catch (erro) {
      return responderJson(res, 400, { erro: erro.message });
    }
  }

  const estatico = ARQUIVOS[url.pathname];
  if (estatico) {
    res.writeHead(200, { 'Content-Type': estatico.tipo });
    return res.end(fs.readFileSync(path.join(__dirname, estatico.arquivo)));
  }

  return responderJson(res, 404, { erro: 'Rota não encontrada' });
}

function criarServidor() {
  return http.createServer((req, res) => {
    tratarRequisicao(req, res).catch(() => responderJson(res, 500, { erro: 'Erro interno' }));
  });
}

if (require.main === module) {
  const porta = Number(process.env.PORT) || 3000;
  criarServidor().listen(porta, () => {
    console.log(`Conversor ouvindo em http://127.0.0.1:${porta}`);
  });
}

module.exports = { criarServidor };
