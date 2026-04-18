# DISTRIBUIÇÃO: Formulário de Intake Profissional

## Passo 1: Criar o Google Forms

1. Acesse [Google Forms](https://forms.google.com)
2. Clique em **"+"** para novo formulário
3. Defina o título: **"ecooa | Formulário de Intake Profissional"**
4. Defina a descrição:
```
Este formulário alimenta sua landing page na ecooa e treina o ecooa.match 
(sistema de triagem que encaminha pacientes para você).

Leva aproximadamente 40 minutos. Suas respostas definem como pacientes te encontram.

Preenchimento esperado: até 7 dias após recebimento do link.
```

5. Use as **5 seções e 21 campos** documentados em `.claude/intake-form-structure.md`
6. Integre com Google Sheets (Forms > Respostas > Criar planilha)
7. **Gere o link do formulário** (será algo como `forms.gle/XXXXXX`)

---

## Passo 2: Email Template para Distribuição

### Assunto:
```
[ação requerida] Preecha seu perfil profissional na ecooa — 40 minutos
```

### Corpo:

```
Olá [NOME],

Você recebeu este formulário porque faz parte do core de profissionais da ecooa.

A partir de agora, usamos um sistema inteligente chamado ecooa.match que direciona 
pacientes para o profissional certo baseado na dor/necessidade específica.

Para funcionar bem, esse sistema precisa conhecer:
- Suas credenciais e formação
- Suas especialidades reais
- As 3 dores principais que seus pacientes trazem
- Suas 10 perguntas mais frequentes (você responde, não o ChatGPT)
- Um caso clínico que representa bem seu trabalho
- Seus valores e programas

Com essas informações, a gente:
✓ Alimenta sua landing page de forma humanizada e confiável
✓ Treina o bot para te encaminhar os pacientes certos
✓ Melhora o SEO da sua página individual
✓ Aumenta sua credibilidade visual (credenciais + caso + FAQ)

## LINK DO FORMULÁRIO:
👉 https://forms.gle/[GERE O SEU LINK ACIMA]

## INSTRUÇÕES RÁPIDAS:
1. Abra o link acima
2. Preencha com calma — não é questionário obrigatório de rotina, é sobre você
3. Respostas curtas e claras (as FAQ devem ser suas respostas reais, não AI)
4. Caso clínico: use um paciente real mas sem identificar (sem nome/CPF)
5. Envie quando pronto — você verá mensagem de confirmação

## PRAZO:
Preenchimento esperado: até 7 dias ([DATA LIMITE])

Se tiver dúvidas sobre algum campo, consulte o final deste email.

---

## DÚVIDAS FREQUENTES:

**P: "Especialidades" é RQE ou áreas em que eu domino?**
R: Áreas que você domina e quer ser encontrado no ecooa.match. RQE fica no registro profissional. Ex: "Metabolismo, Hormônios, Emagrecimento" (não "Clínica Geral").

**P: Preciso preencher tudo ou posso deixar alguns campos em branco?**
R: Quase tudo é obrigatório (nome, unidade, especialidades, FAQs, caso clínico). Apenas uns 2-3 campos são opcionais (pós-grad, residência, frase inspiradora). Se não tiver algo, use N/A.

**P: Minhas FAQs podem ser curtas?**
R: Não. As 10 FAQs que você responde são publicadas na sua landing page E usadas para treinar o bot. Se alguém chega com a pergunta "quando vejo resultado?", o bot busca a FAQ e retorna sua resposta real. Respostas boas = conversão melhor.

**P: Caso clínico — posso inventar?**
R: Não. Tem que ser real. Paciente real (sem identificação). Contexto → investigação → protocolo → resultado. Isso treina o bot sobre como você trabalha de verdade.

**P: Frase inspiradora é obrigatória?**
R: Não, é opcional. Mas quando preenchida fica na página em itálico. Se sua filosofia é "saúde de verdade começa por entender o próprio corpo", adiciona humanidade. Se não tiver uma boa, deixa em branco.

**P: Valores — devo incluir taxa de agendamento ou de consulta?**
R: Consulta. Primeira consulta (avaliação completa) e retorno (follow-up). Não taxa de agendamento.

**P: E se meus valores mudarem depois?**
R: Avisa. Refaz o formulário (atualizamos) ou manda via WhatsApp. Preços na landing page atualizam conforme você atualizar o form.

**P: Devo mencionar concorrentes?**
R: Não. Na seção "áreas que você NÃO atende", fale sobre escopo (ex: "não atendo casos puramente estéticos"). Encaminhe para colega ecooa se indicado, não compete externa.

---

## CHECKLIST ANTES DE ENVIAR PARA OS 30:

- [ ] Google Forms criado com 5 seções
- [ ] Google Sheets integrada (já cria automaticamente)
- [ ] Link do formulário copiado (forms.gle/XXXXX)
- [ ] Email template customizado com seu link
- [ ] Deadline inserido (T+7 dias)
- [ ] Você mesmo preencheu o form (testar fluxo)
- [ ] Verificar que respostas aparecem na planilha
- [ ] Copiar link do form

---

## TIMELINE DE EXECUÇÃO

| Data | Ação | Responsável |
|------|------|-------------|
| T+0 | Criar form + integrar Sheets | você |
| T+0 | Enviar link para os 30 profissionais | você |
| T+2 | Recordar os que não preencheram | você |
| T+5 | Último lembrete (deadline T+7) | você |
| T+8 | Coletar todas as respostas | você |
| T+8 | Rodar script parseIntakeResponses.ts | você ou eu |
| T+9 | Validar dados | eu |
| T+10 | Commit e push para branch | eu |
| T+11 | Deploy site com landing pages novas | você |

---

## ESTRUTURA DO EMAIL (Copiar-colar direto)

```
Assunto: [ação requerida] Preench seu perfil profissional na ecooa — 40 minutos

---

Olá [NOME],

Você recebeu este formulário porque faz parte do core de profissionais da ecooa.

A partir de agora, usamos um sistema chamado ecooa.match que direciona pacientes 
para o profissional certo baseado em sua necessidade específica.

Para funcionar bem, esse sistema precisa conhecer você melhor:
- Suas credenciais e formação
- Suas especialidades reais
- As 3 dores principais que seus pacientes trazem
- Suas 10 perguntas mais frequentes (resposta sua, não AI)
- Um caso clínico que representa bem seu trabalho
- Seus valores e programas

Com isso, a gente:
✓ Alimenta sua landing page de forma humanizada
✓ Treina o bot para encaminhar pacientes certos
✓ Melhora seu SEO individual
✓ Aumenta confiança (credenciais + caso + FAQ)

LINK DO FORMULÁRIO:
👉 https://forms.gle/[seu-link-aqui]

INSTRUÇÕES:
1. Abra o link acima
2. Preencha com calma (~40 min)
3. Respostas claras (FAQs são suas respostas reais, não AI)
4. Caso clínico: paciente real sem identificação
5. Envie quando pronto

PRAZO: até [DATA LIMITE — T+7 DIAS]

Dúvidas? Responda este email ou fale conosco.

Obrigado,
[sua assinatura]
```

---

## APÓS RECEBER AS RESPOSTAS

1. Planilha Google Sheets terá ~32 linhas (header + 30 profissionais + 1-2 testes)
2. Exportar como CSV: Arquivo > Download > CSV
3. Salvar em `scripts/intake-responses.csv`
4. Rodar: `npx ts-node scripts/processIntakeResponses.ts`
5. Verificar `src/data/professionals.ts` foi atualizado
6. Verificar build: `npm run build`
7. Se sem erros: `git add -A && git commit -m "feat: intake profissional processado - 30 profissionais"`
8. Push para seu branch

---

## ESPERADO APÓS PROCESSAMENTO

Cada uma das 30 landing pages (`/profissionais/[slug].astro`) terá:

✅ Seção de credenciais & formação  
✅ Seção de diferencial clínico  
✅ Seção de 10 FAQs (interativa)  
✅ Seção de caso clínico  
✅ Seção de valores & programas  
✅ Todas as seções existentes (sobre, artigos, relacionados)  

**Resultado**: Site ganha ~60,000 palavras de conteúdo único em 1 semana.
