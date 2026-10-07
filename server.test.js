const { criarServidor } = require('./server');

let servidor;
let base;

beforeAll((pronto) => {
  servidor = criarServidor().listen(0, () => {
    base = `http://127.0.0.1:${servidor.address().port}`;
    pronto();
  });
});

afterAll((pronto) => {
  servidor.close(pronto);
});

test('/health responde 200', async () => {
  const resposta = await fetch(`${base}/health`);
  expect(resposta.status).toBe(200);
  expect(await resposta.json()).toEqual({ status: 'ok' });
});

test('/api/converter converte Celsius para Fahrenheit', async () => {
  const resposta = await fetch(`${base}/api/converter?valor=100&direcao=c-para-f`);
  expect(resposta.status).toBe(200);
  expect((await resposta.json()).resultado).toBe(212);
});

test('/api/converter converte Fahrenheit para Celsius', async () => {
  const resposta = await fetch(`${base}/api/converter?valor=32&direcao=f-para-c`);
  expect((await resposta.json()).resultado).toBe(0);
});

test('/api/converter dá 400 com valor inválido', async () => {
  const resposta = await fetch(`${base}/api/converter?valor=abc`);
  expect(resposta.status).toBe(400);
});

test('serve a página inicial', async () => {
  const resposta = await fetch(`${base}/`);
  expect(resposta.status).toBe(200);
  expect(await resposta.text()).toContain('Conversor de Temperatura');
});

test('rota inexistente dá 404', async () => {
  const resposta = await fetch(`${base}/nao-existe`);
  expect(resposta.status).toBe(404);
});
