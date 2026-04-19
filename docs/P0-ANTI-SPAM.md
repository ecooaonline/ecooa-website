# P0 — Anti-Spam em Formulários

**Status**: 🔴 CRÍTICO — Sem proteção visível contra spam/abuso

**Data**: 2026-04-19

**Objetivo**: Implementar honeypot + rate-limit + validação para reduzir spam em agendamento/contato

---

## ACHADO

Formulários em `/agendamento` e `/contato` estão expostos sem proteção contra:
- Bots enviando dados aleatórios
- Submissões repetidas (mesma pessoa/IP múltiplas vezes)
- Dados inválidos (emails fake, telefones incoerentes)

**Impacto**: 
- Ruído operacional em Google Sheets
- Possível ataque DDoS contra Google Apps Script
- Dados lixo afetando relatórios

---

## SOLUÇÃO MULTI-CAMADA

### Camada 1: Client-Side (Frontend)

#### 1a. Honeypot (Invisible Field)
Técnica: Campo invisível para humans, visível para bots.

**Implementação** em `src/components/FormComponent.astro` (ou onde estiver o form):

```html
<!-- Campo normal (visível) -->
<label>
  Seu Nome
  <input type="text" name="nome" required />
</label>

<!-- Honeypot (invisível para humans) -->
<label style="display:none">
  Deixe este campo vazio
  <input 
    type="text" 
    name="_honeypot" 
    tabindex="-1" 
    autocomplete="off"
    style="width:1px;height:1px;opacity:0;position:absolute;left:-9999px"
  />
</label>

<button type="submit">Enviar</button>
```

**Validação antes de submit**:

```javascript
document.querySelector('form').addEventListener('submit', (e) => {
  const honeypot = document.querySelector('[name="_honeypot"]');
  
  if (honeypot && honeypot.value !== '') {
    e.preventDefault();
    console.warn('Possível bot detectado');
    // Silenciosamente falha (não alerta o bot)
    return false;
  }
});
```

#### 1b. Rate-Limit Client-Side
Desabilitar botão de submit por 5-10 segundos após envio.

```javascript
const form = document.querySelector('form');
const button = form.querySelector('[type="submit"]');

form.addEventListener('submit', () => {
  button.disabled = true;
  button.textContent = 'Enviando...';
  button.style.opacity = '0.5';
  
  setTimeout(() => {
    button.disabled = false;
    button.textContent = 'Enviar';
    button.style.opacity = '1';
  }, 5000); // 5 segundos
});
```

#### 1c. Validação de Dados Client-Side

```javascript
function validarForm(nome, email, telefone) {
  // Email simples
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Email inválido');
    return false;
  }
  
  // Telefone brasileiro (11) 99999-9999 ou +55 11 99999-9999
  const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?)\s?9?\d{4}-?\d{4}$/;
  if (!phoneRegex.test(telefone)) {
    alert('Telefone deve ser válido (formato: (51) 99999-9999)');
    return false;
  }
  
  // Nome mínimo 3 caracteres
  if (nome.trim().length < 3) {
    alert('Nome deve ter pelo menos 3 caracteres');
    return false;
  }
  
  return true;
}

form.addEventListener('submit', (e) => {
  const nome = form.querySelector('[name="nome"]').value;
  const email = form.querySelector('[name="email"]').value;
  const telefone = form.querySelector('[name="telefone"]').value;
  
  if (!validarForm(nome, email, telefone)) {
    e.preventDefault();
  }
});
```

---

### Camada 2: Server-Side (Google Apps Script)

Google Apps Script recebe POST e faz validação adicional.

#### 2a. Validação Server-Side (Apps Script)

**Arquivo do Apps Script**:

```javascript
function doPost(e) {
  try {
    // 1. Validar honeypot
    if (e.parameter._honeypot && e.parameter._honeypot !== '') {
      Logger.log('Honeypot triggered: ' + JSON.stringify(e.parameter));
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid submission' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Validar email
    const email = e.parameter.email || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Logger.log('Invalid email: ' + email);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid email' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Validar telefone
    const telefone = e.parameter.telefone || '';
    const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?)\s?9?\d{4}-?\d{4}$/;
    if (!phoneRegex.test(telefone)) {
      Logger.log('Invalid phone: ' + telefone);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid phone' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 4. Validar IP (rate-limit)
    const ip = e.clientIp;
    if (hasSubmittedRecently(ip)) {
      Logger.log('Rate-limited: ' + ip);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Too many requests. Try again later.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 5. Inserir em Sheets
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Respostas');
    const timestamp = new Date();
    
    sheet.appendRow([
      timestamp,
      e.parameter.nome || '',
      e.parameter.email || '',
      e.parameter.telefone || '',
      e.parameter.mensagem || '',
      ip,
      'OK'
    ]);

    // Log de sucesso
    Logger.log('Form submitted successfully by ' + ip);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Submissão recebida!' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Server error' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Rate-limit: máximo 3 submissões por IP a cada 1 hora
function hasSubmittedRecently(ip) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const key = 'ip_' + ip;
  const data = JSON.parse(scriptProperties.getProperty(key) || '{"count": 0, "time": 0}');
  
  const now = new Date().getTime();
  const oneHourAgo = now - (60 * 60 * 1000);

  if (data.time < oneHourAgo) {
    // Expirou, reset
    scriptProperties.setProperty(key, JSON.stringify({ count: 1, time: now }));
    return false;
  }

  if (data.count >= 3) {
    return true; // Rate-limit atingido
  }

  // Atualizar contador
  data.count += 1;
  scriptProperties.setProperty(key, JSON.stringify(data));
  return false;
}
```

---

### Camada 3: Google Sheets (Log & Auditoria)

Adicionar coluna extra `Validação` na planilha:

| Timestamp | Nome | Email | Telefone | Mensagem | IP | Validação | Spam? |
|-----------|------|-------|----------|----------|----|-----------|----- |
| 2026-04-19 10:00 | João Silva | joao@email.com | (51) 99999-9999 | Quero agendar | 192.168.1.1 | OK | Não |
| 2026-04-19 10:15 | xyzabc | xyz@xyz.xyz | 123456 | spam msg | 10.0.0.1 | REJEITADO: email inválido | Sim |

**Fórmula para detectar spam patterns**:

```
=IF(AND(LEN(B2)<3, ISNUMBER(FIND("@",C2))=FALSE), "PROVÁVEL SPAM", "OK")
```

---

## IMPLEMENTAÇÃO PRÁTICA

### Passo 1: Atualizar Componente de Formulário

**Arquivo**: `src/components/FormAgendamento.astro` (ou similar)

```astro
---
import { FORM_ACTION } from '../data/constants';
---

<form id="form-agendamento" method="POST" action={FORM_ACTION}>
  <div class="form-group">
    <label for="nome">Nome Completo</label>
    <input 
      type="text" 
      id="nome" 
      name="nome" 
      required 
      minlength="3"
    />
  </div>

  <div class="form-group">
    <label for="email">E-mail</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      required 
    />
  </div>

  <div class="form-group">
    <label for="telefone">Telefone</label>
    <input 
      type="tel" 
      id="telefone" 
      name="telefone" 
      placeholder="(51) 99999-9999"
      required 
      pattern="\(\d{2}\)\s?9?\d{4}-?\d{4}|\+55\s\d{2}\s9?\d{4}-?\d{4}"
    />
  </div>

  <div class="form-group">
    <label for="mensagem">Mensagem</label>
    <textarea 
      id="mensagem" 
      name="mensagem" 
      rows="4"
    ></textarea>
  </div>

  <!-- Honeypot (invisível) -->
  <input 
    type="text" 
    name="_honeypot" 
    style="position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0;" 
    tabindex="-1" 
    autocomplete="off"
  />

  <button type="submit" id="submit-btn">Enviar</button>
</form>

<script>
  const form = document.getElementById('form-agendamento');
  const button = document.getElementById('submit-btn');

  // Validação + honeypot
  form.addEventListener('submit', (e) => {
    const honeypot = form.querySelector('[name="_honeypot"]');
    
    if (honeypot && honeypot.value.trim() !== '') {
      e.preventDefault();
      return false;
    }

    // Rate-limit visual
    button.disabled = true;
    button.textContent = 'Enviando...';
    
    setTimeout(() => {
      button.disabled = false;
      button.textContent = 'Enviar';
    }, 5000);
  });
</script>

<style>
  form { display: flex; flex-direction: column; gap: 16px; }
  .form-group { display: flex; flex-direction: column; }
  label { font-weight: 500; margin-bottom: 8px; }
  input, textarea { padding: 8px; border: 1px solid var(--color-stone); }
  button { padding: 12px; background: var(--color-brand-deep); color: white; cursor: pointer; }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
```

### Passo 2: Atualizar Google Apps Script

Substituir código existente pelo código do Apps Script acima (camada 2).

### Passo 3: Testar

```bash
# Dev local
npm run dev
# Visitar http://localhost:3000/agendamento

# Testes:
- [ ] Honeypot: abrir DevTools, preencher campo invisível, enviar → deve rejeitar silenciosamente
- [ ] Rate-limit: enviar 2x consecutivos → segundo deve estar desabilitado por 5s
- [ ] Email inválido: enviar "notanemail" → erro
- [ ] Telefone inválido: enviar "123" → erro
- [ ] IP rate-limit: enviar 4 submissões em 1h com mesmo IP → 4ª rejeitada
```

### Passo 4: Deploy

```bash
git add src/components/FormAgendamento.astro
git commit -m "feat(anti-spam): honeypot + rate-limit + validação em formulários

- Honeypot invisível para detectar bots
- Rate-limit 5s client-side (UX)
- Validação email/telefone client + server
- Rate-limit 3 submissões/hora por IP server-side
- Google Apps Script: rejeita honeypot + dados inválidos
- Google Sheets: log de submissões com status de validação

https://claude.ai/code/session_01AuiZkTug3nk3EFpcpTZdMP"

git push origin your-branch
```

---

## MONITORAMENTO

### Métricas para Rastrear

1. **Taxa de rejeição por tipo**:
   - Honeypot bloqueadas
   - Email inválido
   - Telefone inválido
   - Rate-limit

2. **Padrões suspeitos**:
   - Múltiplas submissões do mesmo IP
   - Nomes/emails aleatórios
   - Mensagens repetidas

3. **Google Sheets**:
   - Coluna "Validação" com valores OK / REJEITADO: [motivo]
   - Filter view para "Validação != OK" para revisar falsos negativos

### Dashboard (opcional)

Criar planilha separada `Analytics` com:

```
=COUNTIF(Respostas!F:F, "Honeypot")
=COUNTIF(Respostas!F:F, "Email inválido")
=COUNTIF(Respostas!F:F, "OK")
```

---

## TIMELINE

- **T+0**: Revisar esta proposta (Dev lead)
- **T+1**: Atualizar componentes de form + Apps Script
- **T+2**: Testes end-to-end
- **T+3**: Deploy (Vercel)
- **T+3+**: Monitorar por 1 semana, ajustar rate-limits conforme necessário

---

## RESPONSÁVEIS

- **Dev**: Implementar honeypot, validação client, atualizar Apps Script
- **Ops**: Monitorar Google Sheets, revisar rejeições legítimas

---

**Status**: 🟡 Pronto para desenvolvimento (aguarda aprovação de Tech Lead)

**Bloqueador de Deploy**: SIM — Sem anti-spam, site vulnerável a spam/abuso

**Prioridade**: P0
