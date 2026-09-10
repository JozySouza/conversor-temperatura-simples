# Revisão dos testes usando IA

Como parte do projeto, usei uma IA generativa (Claude) para revisar o
arquivo `converter.test.js` e sugerir testes que eu não tinha pensado.

## O que eu perguntei para a IA

> "Aqui está meu código (`converter.js`) e meus testes
> (`converter.test.js`). Você consegue apontar o que não está sendo
> testado e sugerir novos testes?"

## O que a IA respondeu

1. **Falta testar números negativos válidos**, como -10°C → 14°F.
2. **Falta um teste de "ida e volta"**: converter de Celsius para
   Fahrenheit e voltar deveria dar (aproximadamente) o valor original.
3. **Sugestão de novo teste:**
   ```js
   test('-10°C deve virar 14°F', () => {
     expect(celsiusParaFahrenheit(-10)).toBe(14);
   });
   ```

## O que eu fiz com a sugestão

Adicionei o teste de número negativo sugerido pela IA no arquivo
`converter.test.js`, deixando a suíte mais completa.

---
*Esse é um exemplo real de como a IA pode ajudar a encontrar pontos que
passaram despercebidos na hora de escrever os testes — um bom uso de IA
generativa dentro do fluxo de desenvolvimento (o tema da disciplina).*
