/**
 * Google Apps Script - Template para formulários de sites Tier 5+
 *
 * Instruções:
 * 1. Criar planilha no Google Sheets
 * 2. Extensions > Apps Script
 * 3. Colar este código
 * 4. Deploy > New deployment > Web app
 * 5. Execute as: Me | Who has access: Anyone
 * 6. Copiar URL do deployment e usar no form-submit.ts
 *
 * Abas criadas automaticamente:
 * - agendamento (leads de agendamento)
 * - contato (mensagens do formulário de contato)
 * - newsletter (inscrições de newsletter)
 * - followUp (controle de follow-up pendente)
 */

// ============================================================
// CONFIGURAÇÃO - ALTERAR PARA CADA PROJETO
// ============================================================

const CONFIG = {
  notificationEmail: 'TODO_EMAIL_ADMIN',
  siteName: 'TODO_NOME_SITE',
  siteUrl: 'TODO_URL_SITE',
  followUpHours: 2,
};

const PROFESSIONAL_NAMES = {
  // 'slug-do-profissional': 'Nome Completo',
  // Exemplo:
  // 'joao-silva': 'Dr. João Silva',
};

// ============================================================
// HANDLER PRINCIPAL
// ============================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const formType = data._formType || 'contato';

    delete data._formType;

    const handlers = {
      agendamento: handleAgendamento,
      contato: handleContato,
      newsletter: handleNewsletter,
      'b2b-medicina': handleB2B,
      'b2b-nutricao': handleB2B,
    };

    const handler = handlers[formType] || handleContato;
    handler(data, formType);

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok', formType })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// HANDLERS POR TIPO
// ============================================================

function handleAgendamento(data) {
  const sheet = getOrCreateSheet('agendamento', [
    'Timestamp',
    'Nome',
    'WhatsApp',
    'Serviço',
    'Profissional Recomendado',
    'Match Intent',
    'Origem',
    'Status',
  ]);

  const profName = data.matchProfessional
    ? PROFESSIONAL_NAMES[data.matchProfessional] || data.matchProfessional
    : '';

  sheet.appendRow([
    new Date(),
    data.nome || '',
    data.whatsapp || '',
    data.servico || '',
    profName,
    data.matchIntent || '',
    data.origem || 'site',
    'Novo',
  ]);

  createFollowUp(data, 'agendamento');

  sendNotification('agendamento', data, profName);
}

function handleContato(data) {
  const sheet = getOrCreateSheet('contato', [
    'Timestamp',
    'Nome',
    'Email',
    'Assunto',
    'Mensagem',
    'Status',
  ]);

  sheet.appendRow([
    new Date(),
    data.nome || '',
    data.email || '',
    data.assunto || '',
    data.mensagem || '',
    'Novo',
  ]);

  createFollowUp(data, 'contato');

  sendNotification('contato', data);
}

function handleNewsletter(data) {
  const sheet = getOrCreateSheet('newsletter', [
    'Timestamp',
    'Email',
    'Origem',
    'Status',
  ]);

  const emails = sheet
    .getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1)
    .getValues()
    .flat();

  if (emails.includes(data.email)) {
    return;
  }

  sheet.appendRow([new Date(), data.email || '', data.origem || 'site', 'Ativo']);
}

function handleB2B(data, formType) {
  const sheet = getOrCreateSheet(formType, [
    'Timestamp',
    'Nome',
    'Email',
    'Empresa',
    'Telefone',
    'Mensagem',
    'Status',
  ]);

  sheet.appendRow([
    new Date(),
    data.nome || '',
    data.email || '',
    data.empresa || '',
    data.telefone || '',
    data.mensagem || '',
    'Novo',
  ]);

  createFollowUp(data, formType);

  sendNotification(formType, data);

  if (data.email) {
    sendAutoResponse(formType, data);
  }
}

// ============================================================
// FOLLOW-UP
// ============================================================

function createFollowUp(data, formType) {
  const sheet = getOrCreateSheet('followUp', [
    'Timestamp',
    'Tipo',
    'Nome',
    'Contato',
    'Profissional',
    'Status',
    'Due Date',
  ]);

  const dueDate = new Date();
  dueDate.setHours(dueDate.getHours() + CONFIG.followUpHours);

  sheet.appendRow([
    new Date(),
    formType,
    data.nome || data.email || '',
    data.whatsapp || data.email || data.telefone || '',
    data.matchProfessional
      ? PROFESSIONAL_NAMES[data.matchProfessional] || data.matchProfessional
      : '',
    'Pendente',
    dueDate,
  ]);
}

/**
 * Trigger time-driven: verificar follow-ups pendentes.
 *
 * Configuração manual:
 * 1. No editor Apps Script, ir em Triggers (relógio)
 * 2. Add Trigger
 * 3. Function: checkFollowUps
 * 4. Event source: Time-driven
 * 5. Type: Hours timer
 * 6. Interval: Every 2 hours
 */
function checkFollowUps() {
  const sheet = getOrCreateSheet('followUp');
  if (sheet.getLastRow() <= 1) return;

  const data = sheet.getDataRange().getValues();
  const now = new Date();
  const pending = [];

  for (let i = 1; i < data.length; i++) {
    const status = data[i][5];
    const dueDate = new Date(data[i][6]);

    if (status === 'Pendente' && dueDate <= now) {
      pending.push({
        row: i + 1,
        tipo: data[i][1],
        nome: data[i][2],
        contato: data[i][3],
        profissional: data[i][4],
      });
    }
  }

  if (pending.length === 0) return;

  let body = `<h2>Follow-ups pendentes - ${CONFIG.siteName}</h2>`;
  body += '<table border="1" cellpadding="8" style="border-collapse:collapse">';
  body += '<tr><th>Tipo</th><th>Nome</th><th>Contato</th><th>Profissional</th></tr>';

  for (const p of pending) {
    body += `<tr><td>${p.tipo}</td><td>${p.nome}</td><td>${p.contato}</td><td>${p.profissional || '-'}</td></tr>`;
  }

  body += '</table>';
  body += `<p><a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}">Abrir planilha</a></p>`;

  MailApp.sendEmail({
    to: CONFIG.notificationEmail,
    subject: `[${CONFIG.siteName}] ${pending.length} follow-up(s) pendente(s)`,
    htmlBody: body,
  });
}

// ============================================================
// NOTIFICAÇÕES
// ============================================================

function sendNotification(formType, data, profName) {
  const labels = {
    agendamento: 'Novo Agendamento',
    contato: 'Nova Mensagem',
    'b2b-medicina': 'Novo Lead B2B (Medicina)',
    'b2b-nutricao': 'Novo Lead B2B (Nutrição)',
  };

  let body = `<h2>${labels[formType] || 'Novo Lead'}</h2>`;
  body += '<table cellpadding="8">';

  const skipFields = ['matchProfessional', 'matchIntent', 'origem', '_formType'];

  for (const [key, value] of Object.entries(data)) {
    if (skipFields.includes(key) || !value) continue;
    body += `<tr><td><strong>${formatLabel(key)}</strong></td><td>${value}</td></tr>`;
  }

  body += '</table>';

  if (data.matchProfessional) {
    const slug = data.matchProfessional;
    const name = profName || PROFESSIONAL_NAMES[slug] || slug;
    body += '<hr>';
    body += '<h3>Triado pelo sistema de match</h3>';
    body += `<p><strong>Profissional recomendado:</strong> ${name}</p>`;
    if (data.matchIntent) {
      body += `<p><strong>Intenção:</strong> ${data.matchIntent}</p>`;
    }
    body += `<p><a href="${CONFIG.siteUrl}/profissionais/${slug}">Ver perfil</a></p>`;
  }

  body += `<p style="margin-top:20px;color:#999;font-size:12px">Enviado automaticamente por ${CONFIG.siteName}</p>`;

  MailApp.sendEmail({
    to: CONFIG.notificationEmail,
    subject: `[${CONFIG.siteName}] ${labels[formType] || formType}`,
    htmlBody: body,
  });
}

function sendAutoResponse(formType, data) {
  if (!data.email) return;

  const labels = {
    'b2b-medicina': 'parceria em medicina',
    'b2b-nutricao': 'parceria em nutrição',
    contato: 'contato',
  };

  const body = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2>Recebemos sua mensagem!</h2>
      <p>Olá${data.nome ? ` ${data.nome.split(' ')[0]}` : ''},</p>
      <p>Obrigado pelo seu interesse em ${labels[formType] || 'nossos serviços'}.
         Recebemos seus dados e nossa equipe entrará em contato em até 24 horas úteis.</p>
      <p>Enquanto isso, conheça mais sobre nosso trabalho em
         <a href="${CONFIG.siteUrl}">${CONFIG.siteUrl}</a>.</p>
      <br>
      <p>Atenciosamente,<br><strong>Equipe ${CONFIG.siteName}</strong></p>
    </div>
  `;

  MailApp.sendEmail({
    to: data.email,
    subject: `${CONFIG.siteName} - Recebemos sua mensagem`,
    htmlBody: body,
  });
}

// ============================================================
// NEWSLETTER DIGEST
// ============================================================

/**
 * Gera draft de newsletter com os posts mais recentes.
 *
 * Configuração:
 * 1. Trigger mensal ou sob demanda
 * 2. Alterar RSS_URL para o feed do site
 * 3. Draft é enviado para CONFIG.notificationEmail
 * 4. Equipe revisa e envia manualmente
 */
function generateNewsletterDigest() {
  const RSS_URL = CONFIG.siteUrl + '/rss.xml';

  let posts = [];
  try {
    const response = UrlFetchApp.fetch(RSS_URL);
    const xml = XmlService.parse(response.getContentText());
    const root = xml.getRootElement();
    const ns = root.getNamespace();
    const channel = root.getChild('channel', ns);
    const items = channel.getChildren('item', ns);

    for (let i = 0; i < Math.min(items.length, 3); i++) {
      const item = items[i];
      posts.push({
        title: item.getChildText('title', ns),
        link: item.getChildText('link', ns),
        description: item.getChildText('description', ns) || '',
      });
    }
  } catch (err) {
    posts = [
      {
        title: 'Erro ao buscar RSS',
        link: CONFIG.siteUrl + '/blog',
        description: err.message,
      },
    ];
  }

  let body = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h1 style="font-size:24px">${CONFIG.siteName}</h1>
      <p>Confira nossos artigos mais recentes:</p>
  `;

  for (const post of posts) {
    body += `
      <div style="margin:20px 0;padding:16px;border:1px solid #eee;border-radius:4px">
        <h2 style="font-size:18px;margin:0 0 8px"><a href="${post.link}">${post.title}</a></h2>
        <p style="color:#666;font-size:14px;margin:0">${post.description.substring(0, 150)}...</p>
      </div>
    `;
  }

  body += `
      <p style="text-align:center;margin-top:30px">
        <a href="${CONFIG.siteUrl}/blog" style="background:#1c1917;color:#fff;padding:12px 24px;text-decoration:none;border-radius:2px">
          ver todos os artigos
        </a>
      </p>
      <p style="margin-top:40px;color:#999;font-size:11px;text-align:center">
        Você recebe este email porque se inscreveu em ${CONFIG.siteName}.<br>
        <a href="${CONFIG.siteUrl}/politica-de-privacidade">Política de privacidade</a>
      </p>
    </div>
  `;

  GmailApp.createDraft(
    CONFIG.notificationEmail,
    `[${CONFIG.siteName}] Newsletter - ${new Date().toLocaleDateString('pt-BR')}`,
    '',
    { htmlBody: body }
  );
}

// ============================================================
// UTILITÁRIOS
// ============================================================

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }

  return sheet;
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, ' ');
}
