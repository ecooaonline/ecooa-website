# P0 — Alinhamento Formulário & Política de Privacidade

**Status**: 🔴 CRÍTICO — Inconsistência entre implementação e política

**Data**: 2026-04-19

---

## ACHADO

### Implementação (src/data/constants.ts)
```typescript
export const FORM_ACTION = 'https://script.google.com/macros/s/AKfycbx3NOzVryn9prCJvKuBH20EFGiHoCENEZdR73zjaeiiUCl9PXk2sKrzGxrcrQ3ahQ-v/exec';
```

**Stack usado**: Google Apps Script + Google Sheets

---

### Política de Privacidade (src/pages/politica-de-privacidade.astro)

Linha 28:
```
Dados de formulários: nome, e-mail, telefone e mensagem enviados voluntariamente 
por meio dos formulários de contato e agendamento, processados pela plataforma Formspree.
```

Linha 53:
```
Formspree: processamento de formulários de contato e agendamento.
```

**Stack mencionado**: Formspree

---

## PROBLEMA

**Mismatch 1:1** → Pode gerar não-conformidade LGPD:
- Se usar Google Apps Script mas política diz Formspree, há falsa declaração sobre quem processa dados
- Se regulador auditar, vê inconsistência
- Risco: multa LGPD, perda de confiança

---

## RESOLUÇÃO NECESSÁRIA

### Opção A: Usar Google Apps Script (atual, implementado)

**Ações**:
1. Atualizar política (politica-de-privacidade.astro) para remover menção a Formspree
2. Adicionar Google Apps Script como processador
3. Detalhar fluxo: Forms → Apps Script → Google Sheets
4. Documentar retenção de dados em Sheets

**Novo texto na política**:
```markdown
**Dados de formulários:** nome, e-mail, telefone e mensagem enviados voluntariamente 
por meio dos formulários de contato e agendamento. Os formulários são processados 
por Google Apps Script e os dados são armazenados em Google Sheets.

Formulários processadores:
- Google Apps Script: recebe dados do formulário HTML
- Google Sheets: armazena respostas para consulta operacional
```

**Privacidade**: Google (como controladora) tem SUAS obrigações LGPD

---

### Opção B: Usar Formspree (conforme política)

**Ações**:
1. Migrar formulários de Google Apps Script para Formspree
2. Atualizar constants.ts com endpoint do Formspree
3. Testar todos os formulários (agendamento, contato)
4. Manter menção a Formspree na política

**Pros**: 
- Formspree tem compliance GDPR/LGPD built-in
- Menos risco legal
- Menos dados tocados diretamente pela ecooa

**Cons**:
- Requer integração com Formspree (API key, redirecionar para Sheets se quiser)
- Possível custo se usar plano pago

---

## RECOMENDAÇÃO

**Recomendo Opção A** (Google Apps Script) porque:
1. Já está implementado
2. Integração direta com Sheets é mais rápida operacionalmente
3. Mais barato que Formspree pago
4. Apenas requer atualizar a política (15 minutos)

**Trade-off**: Ecooa fica responsável por compliance LGPD direto (não delegado)

---

## IMPLEMENTAÇÃO P0 — OPÇÃO A

### Passo 1: Atualizar Política de Privacidade
**Arquivo**: `src/pages/politica-de-privacidade.astro`

**Remover**:
```
Dados de formulários: nome, e-mail, telefone e mensagem enviados voluntariamente 
por meio dos formulários de contato e agendamento, processados pela plataforma Formspree.
```

**Adicionar**:
```
Dados de formulários: nome, e-mail, telefone e mensagem (contato) ou nome, 
telefone, assunto e mensagem (agendamento), enviados voluntariamente por meio dos 
formulários disponíveis no site. Esses formulários são processados por Google Apps Script 
e os dados são armazenados em Google Sheets para fins operacionais e atendimento.

Processadores: Google Apps Script e Google Sheets (pertencem ao Google LLC, sediada 
nos EUA). Você concorda com a transferência de dados para servidores Google ao 
submeter o formulário.
```

**Na seção "Compartilhamento de dados" (item 5), remover Formspree e adicionar:**
```
Google (Google Apps Script + Google Sheets): processamento e armazenamento de 
formulários de contato e agendamento.
```

**Na seção "Retenção de dados", adicionar:**
```
Dados de formulários: retidos em Google Sheets por no mínimo 3 anos para fins 
operacionais e compliance, podendo ser eliminados após esse período mediante solicitação.
```

---

### Passo 2: Documentar Fluxo de Formulários

**Criar arquivo**: `docs/FORMULARIOS-FLUXO.md`

```markdown
# Fluxo de Formulários — ecooa.website

## Formulários Ativos

| Formulário | URL | Processamento | Destino |
|-----------|-----|---------------|---------|
| Agendamento | /agendamento | Google Apps Script | Google Sheets |
| Contato | /contato | Google Apps Script | Google Sheets |
| Intake Profissional | https://forms.gle/ZcUYDzhNcUsr5Hau5 | Google Forms nativo | Google Sheets integrada |

## Apps Script Detalhe

**URL**: https://script.google.com/macros/s/AKfycbx3NOzVryn9prCJvKuBH20EFGiHoCENEZdR73zjaeiiUCl9PXk2sKrzGxrcrQ3ahQ-v/exec

**Função**: Recebe POST com dados de formulário HTML, valida, insere linha em Google Sheets

**Planilha Destino**: [Nome da planilha — TBD]

**Colunas**: 
- Agendamento: timestamp, nome, telefone, mensagem, IP (para rate-limit)
- Contato: timestamp, nome, email, assunto, mensagem, IP

## Segurança

- [ ] Rate-limit implementado (honeypot + tempo mínimo entre submissões)
- [ ] Validação de email/telefone server-side
- [ ] Log de submissões com IP para auditoria
- [ ] HTTPS em todos os endpoints
- [ ] Google Sheets com acesso restrito (apenas ecooa.adm@gmail.com e Gustavo)

## Compliance LGPD

- [ ] Consentimento coletado (checkbox "Li e aceito a política")
- [ ] Política linkada em cada formulário
- [ ] Direito ao acesso documentado (processar via ecooa.adm@gmail.com)
- [ ] Direito à exclusão documentado (processar em até 30 dias)
- [ ] Retenção mínima: 3 anos (razão: histórico operacional)
```

---

### Passo 3: Validar Formulários Existentes

**Checklist**:
- [ ] /agendamento — Tem checkbox de consentimento? Tem link para política?
- [ ] /contato — Tem checkbox de consentimento? Tem link para política?
- [ ] Google Sheets com dados — Acesso restrito? Backup realizado?

---

### Passo 4: Implementar Anti-Spam (P0 Paralelo)

**Arquivo**: `src/components/FormSubmit.astro` (ou onde estiver o form)

**Adicionar**:
1. **Honeypot**: Campo `_name` invisível (bots preenchem, humans não veem)
2. **Rate-limit client**: Desabilitar submit button por 5s após envio
3. **Validação email**: Regex simples + verificação de domínio
4. **Validação telefone**: +55 (11) XXXXX-XXXX ou similar

**Exemplo honeypot**:
```html
<input type="text" name="_name" style="display:none" tabindex="-1">
```

**Exemplo rate-limit**:
```javascript
const button = document.querySelector('[data-submit]');
button.addEventListener('click', () => {
  button.disabled = true;
  button.textContent = 'Enviando...';
  setTimeout(() => {
    button.disabled = false;
    button.textContent = 'Enviar';
  }, 5000); // 5 segundos
});
```

---

## TIMELINE

- **T+0** (agora): Revisão jurídica desta proposta (Jessica)
- **T+1**: Atualizar política + criar docs (Dev)
- **T+1**: Validar formulários + implementar honeypot (Dev)
- **T+3**: Teste end-to-end de todos os formulários
- **T+5**: Deploy com política atualizada
- **T+5+**: Monitorar submissões para spam

---

## RESPONSÁVEIS

- **Jurídico (Jessica)**: Revisar proposta, aprovar rewrite de política
- **Dev**: Implementar honeypot, atualizar política, testes
- **Ops (Gustavo)**: Validar acesso a Google Sheets, confirmar retenção de dados

---

**Status**: 🟠 Aguardando aprovação de Jessica (jurídico)

**Bloqueador de Deploy**: SIM — Não publicar até conformidade estar ok

**Prioridade**: P0
