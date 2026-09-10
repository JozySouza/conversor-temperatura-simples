# Conversor de Temperatura

Projeto simples para a disciplina de Automação DevOps e IA Generativa.
Converte temperaturas entre Celsius e Fahrenheit.

## Arquivos do projeto

```
index.html          -> a tela (abrir no navegador)
style.css           -> estilo da tela
converter.js         -> as duas funções de conversão
converter.test.js    -> os testes (Jest)
.eslintrc.json       -> regras do linter
package.json         -> dependências e comandos
.github/workflows/   -> pipeline de CI (roda sozinha no GitHub)
terraform/main.tf    -> exemplo mínimo de infraestrutura como código
AI_REVIEW.md         -> exemplo de uso de IA para revisar os testes
```

## Como rodar

```bash
npm install       # instala jest e eslint
npm run lint      # verifica o código
npm test          # roda os testes com relatório de cobertura
```

Para ver a tela, é só abrir o arquivo `index.html` no navegador.

## Roteiro sugerido para a apresentação

1. **Mostrar a tela** (`index.html`) funcionando — digitar um valor e converter.
2. **Mostrar `converter.js`** — só duas funções, com uma validação simples
   que lança erro se o valor não for número.
3. **Mostrar `converter.test.js`** — explicar que tem testes de **acerto**
   (a conversão dá o valor certo) e testes de **erro** (entrada inválida
   lança exceção). Rodar `npm test` ao vivo e mostrar o relatório de
   cobertura no terminal.
4. **Mostrar `npm run lint`** — explicar que o linter verifica o padrão
   do código antes de ele ir para produção.
5. **Mostrar `AI_REVIEW.md`** — explicar que a suíte de testes foi revisada
   por uma IA generativa, que sugeriu um teste que faltava (o de número
   negativo), e que esse teste foi incorporado ao projeto.
6. **Mostrar `.github/workflows/ci.yml`** — explicar que, a cada `push`,
   o GitHub roda automaticamente o linter e os testes (pipeline de CI).
7. **Mostrar `terraform/main.tf`** — rodar `terraform init` e
   `terraform apply` ao vivo (não precisa de conta na nuvem, ele só cria
   um arquivo local) para demonstrar o conceito de infraestrutura como
   código.

## Requisitos atendidos

- Tela simples ✅
- Pipeline de CI ✅
- Linter ✅
- Cobertura de testes, com acertos e erros ✅
- Revisão de testes por IA ✅
- Terraform ✅
