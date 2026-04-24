// ============================================================
// ECOOA - Google Apps Script para formulários do site
// Recebe dados de 4 tipos de formulário, salva no Sheets
// e envia notificação por e-mail para ecooa.adm@gmail.com
// ============================================================

const EMAIL_TO = 'ecooa.adm@gmail.com';
const SHEET_NAME = 'ecooa-formularios';

// Segurança
const ALLOWED_FORM_TYPES = ['agendamento', 'b2b-medicina', 'b2b-nutricao', 'newsletter'];
const ALLOWED_REDIRECT_HOSTS = ['somosecooa.com.br', 'www.somosecooa.com.br', 'ecooaonline.github.io'];
const MAX_FIELD_LENGTH = 500;
const MAX_SUBMISSIONS_PER_HOUR = 10;
const MAX_TOTAL_FIELDS = 20;

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      return jsonResponse({ success: false, message: 'Requisição inválida.' });
    }

    // Rate limiting por IP (via CacheService)
    const clientKey = getClientKey(e);
    if (!checkRateLimit(clientKey)) {
      return jsonResponse({ success: false, message: 'Limite de envios excedido. Tente novamente em uma hora.' });
    }

    // Sanitizar entrada
    const data = sanitizeInput(e.parameter);

    // Validar tipo de formulário (allowlist)
    const formType = data._formType;
    if (!formType || ALLOWED_FORM_TYPES.indexOf(formType) === -1) {
      return jsonResponse({ success: false, message: 'Tipo de formulário inválido.' });
    }

    // Validações por tipo
    const validationError = validateFormData(formType, data);
    if (validationError) {
      return jsonResponse({ success: false, message: validationError });
    }

    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // Salvar no Google Sheets
    saveToSheet(formType, data, timestamp);

    // Registrar follow-up para leads de conversão (agendamento e B2B).
    // Newsletter não gera follow-up manual.
    if (formType === 'agendamento' || formType === 'b2b-medicina' || formType === 'b2b-nutricao') {
      try {
        logFollowUp(formType, data, timestamp);
      } catch (followUpErr) {
        // Follow-up failure must not block lead capture. Log and continue.
        console.error('logFollowUp error:', followUpErr);
      }
    }

    // Enviar e-mail de notificação
    sendNotification(formType, data, timestamp);

    // Redirect com allowlist
    const redirectUrl = data._next || '';
    if (redirectUrl && isAllowedRedirect(redirectUrl)) {
      const safeUrl = escapeHtml(redirectUrl);
      return HtmlService.createHtmlOutput(
        '<meta http-equiv="refresh" content="0;url=' + safeUrl + '">'
      );
    }

    return jsonResponse({ success: true, message: 'Formulário recebido com sucesso.' });

  } catch (error) {
    console.error('doPost error:', error);
    return jsonResponse({ success: false, message: 'Erro ao processar solicitação.' });
  }
}

function doGet(e) {
  return jsonResponse({ status: 'online', service: 'ecooa-forms' });
}

// ============================================================
// SEGURANÇA E VALIDAÇÃO
// ============================================================

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getClientKey(e) {
  // Apps Script não expõe IP do cliente. Usamos hash de User-Agent + minuto
  // como proxy limitado. Para bloqueio real, usar Cloudflare Turnstile no front.
  const ua = (e.parameter && e.parameter._ua) || 'anon';
  const hour = Math.floor(Date.now() / (60 * 60 * 1000));
  return 'rl_' + Utilities.base64Encode(ua).substring(0, 20) + '_' + hour;
}

function checkRateLimit(key) {
  const cache = CacheService.getScriptCache();
  const raw = cache.get(key);
  const count = raw ? parseInt(raw, 10) : 0;
  if (count >= MAX_SUBMISSIONS_PER_HOUR) return false;
  cache.put(key, String(count + 1), 3600);
  return true;
}

function sanitizeInput(parameter) {
  const data = {};
  const keys = Object.keys(parameter).slice(0, MAX_TOTAL_FIELDS);
  keys.forEach(function(key) {
    const rawValue = parameter[key];
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (typeof value === 'string') {
      data[key] = value.substring(0, MAX_FIELD_LENGTH).trim();
    }
  });
  return data;
}

function validateFormData(formType, data) {
  const isValidEmail = function(e) {
    return typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  };
  const isValidPhone = function(p) {
    const digits = String(p || '').replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 13;
  };

  switch (formType) {
    case 'agendamento':
      if (!data.name || data.name.length < 2) return 'Nome inválido.';
      if (!isValidPhone(data.whatsapp)) return 'WhatsApp inválido.';
      break;
    case 'b2b-medicina':
      if (!data.nome || data.nome.length < 2) return 'Nome inválido.';
      if (!isValidPhone(data.whatsapp)) return 'WhatsApp inválido.';
      if (!isValidEmail(data.email)) return 'E-mail inválido.';
      break;
    case 'b2b-nutricao':
      if (!data.nome || data.nome.length < 2) return 'Nome inválido.';
      if (!isValidPhone(data.whatsapp)) return 'WhatsApp inválido.';
      break;
    case 'newsletter':
      if (!isValidEmail(data.email)) return 'E-mail inválido.';
      break;
  }
  return null;
}

function isAllowedRedirect(url) {
  try {
    const match = url.match(/^https?:\/\/([^\/]+)/i);
    if (!match) return false;
    const host = match[1].toLowerCase();
    return ALLOWED_REDIRECT_HOSTS.indexOf(host) !== -1;
  } catch (err) {
    return false;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================================
// SALVAR NO GOOGLE SHEETS
// ============================================================

function saveToSheet(formType, data, timestamp) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
    || SpreadsheetApp.create(SHEET_NAME);

  let sheet = ss.getSheetByName(formType);

  if (!sheet) {
    sheet = ss.insertSheet(formType);
    const headers = getHeaders(formType);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  const row = getRow(formType, data, timestamp);
  sheet.appendRow(row);
}

function getHeaders(formType) {
  switch (formType) {
    case 'agendamento':
      return ['Data/Hora', 'Nome', 'WhatsApp', 'Interesse', 'Profissional Recomendado', 'Match Intent', 'Status'];
    case 'b2b-medicina':
      return ['Data/Hora', 'Nome', 'WhatsApp', 'E-mail', 'Status'];
    case 'b2b-nutricao':
      return ['Data/Hora', 'Nome', 'Área de atuação', 'WhatsApp', 'Status'];
    case 'newsletter':
      return ['Data/Hora', 'E-mail', 'Origem', 'Status'];
    default:
      return ['Data/Hora', 'Dados', 'Status'];
  }
}

function getRow(formType, data, timestamp) {
  switch (formType) {
    case 'agendamento':
      return [
        timestamp,
        data.name || '',
        data.whatsapp || '',
        data.interest || '',
        data.matchProfessional || '',
        data.matchIntent || '',
        'Novo'
      ];
    case 'b2b-medicina':
      return [timestamp, data.nome || '', data.whatsapp || '', data.email || '', 'Novo'];
    case 'b2b-nutricao':
      return [timestamp, data.nome || '', data.area || '', data.whatsapp || '', 'Novo'];
    case 'newsletter':
      return [timestamp, data.email || '', data._source || 'site', 'Novo'];
    default:
      return [timestamp, JSON.stringify(data), 'Novo'];
  }
}

// Map of professional slug → human-readable name.
// Used for email notifications when match handoff is present.
// Keep in sync with src/data/professionals.ts (slug + name fields).
const PROFESSIONAL_NAMES = {
  'gustavo-gehrke': 'Gustavo Gehrke',
  'danusa-pires': 'Danusa Pires',
  'viviane-fagundes': 'Viviane Fagundes',
  'yale-jeronimo': 'Yale Jeronimo',
  'larissa-wiebbelling': 'Larissa Wiebbelling',
  'cris-neumann': 'Cris Neumann',
  'susan-flach': 'Susan Flach',
  'natalie-queiroz': 'Natálie Queiroz',
  'vitoria-machado': 'Vitória Machado',
  'renata-bohn': 'Renata Bohn',
  'karine-ellwanger': 'Karine Ellwanger',
  'leticia-de-melo': 'Leticia de Melo',
  'jennifer-adam': 'Jennifer Adam',
  'jamylle-farias': 'Jamylle Farias',
  'adriana': 'Adriana',
  'jessica-stein': 'Jessica Stein',
  'maria-luisa-beltran': 'Maria Luísa Beltran',
  'adriano-lenz': 'Adriano Lenz',
  'giancarla-rochemback': 'Giancarla Rochemback',
  'vitoria-serpa': 'Vitoria Serpa',
  'lara-caye': 'Lara Caye',
  'gabrieli-klagenberg': 'Gabrieli Klagenberg',
  'daniel-forster': 'Daniel Forster',
  'marvin-marques': 'Marvin Marques',
  'camila-cadore': 'Camila Cadore',
  'nasser-salem': 'Nasser Salem',
  'verena-cattani': 'Verena Cattani',
  'manuela-vanti': 'Manuela Vanti',
  'augusto-kauer': 'Augusto Kauer',
  'francielle-beria': 'Francielle Beria'
};

function resolveProfessionalName(slug) {
  if (!slug) return '';
  return PROFESSIONAL_NAMES[slug] || slug;
}

// ============================================================
// NOTIFICAÇÃO POR E-MAIL
// ============================================================

function sendNotification(formType, data, timestamp) {
  const labels = {
    'agendamento': 'Novo agendamento',
    'b2b-medicina': 'Interesse B2B (Medicina)',
    'b2b-nutricao': 'Interesse B2B (Nutrição)',
    'newsletter': 'Nova inscrição newsletter'
  };

  const subject = 'ecooa | ' + (labels[formType] || 'Novo formulário');

  let body = '<div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto">';
  body += '<div style="background:#1a1a1a;color:white;padding:20px 24px;border-radius:8px 8px 0 0">';
  body += '<h2 style="margin:0;font-size:18px;font-weight:400">' + escapeHtml(labels[formType] || 'Formulário') + '</h2>';
  body += '<p style="margin:4px 0 0;font-size:12px;opacity:.6">' + escapeHtml(timestamp) + '</p>';
  body += '</div>';
  body += '<div style="background:#f9f8f6;padding:24px;border:1px solid #e5e1dc;border-top:0;border-radius:0 0 8px 8px">';

  const fieldLabels = {
    name: 'Nome', nome: 'Nome', whatsapp: 'WhatsApp', email: 'E-mail',
    interest: 'Interesse', area: 'Área de atuação', _source: 'Origem'
  };

  // Skip match-specific fields in the generic field loop; they render in their own section.
  const MATCH_FIELDS = { matchProfessional: true, matchIntent: true };

  Object.keys(data).forEach(function(key) {
    if (key.charAt(0) === '_' && key !== '_source') return;
    if (MATCH_FIELDS[key]) return;
    const label = fieldLabels[key] || key;
    body += '<p style="margin:0 0 12px"><strong style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:.05em">' + escapeHtml(label) + '</strong><br>';
    body += '<span style="font-size:15px;color:#1a1a1a">' + escapeHtml(data[key] || '-') + '</span></p>';
  });

  // Match handoff section: render only if ecooa.match routed this lead.
  if (data.matchProfessional) {
    const profSlug = data.matchProfessional;
    const profName = resolveProfessionalName(profSlug);
    const intentId = data.matchIntent || 'busca livre';
    body += '<div style="margin-top:18px;padding:14px 16px;background:#fff;border:1px solid #e5e1dc;border-left:3px solid #7a8a7f">';
    body += '<p style="margin:0 0 6px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#7a8a7f">Triado pelo ecooa.match</p>';
    body += '<p style="margin:0 0 4px;font-size:14px;color:#1a1a1a"><strong>Profissional recomendado:</strong> ' + escapeHtml(profName) + '</p>';
    body += '<p style="margin:0 0 10px;font-size:13px;color:#666"><strong>Intenção detectada:</strong> ' + escapeHtml(intentId) + '</p>';
    body += '<a href="https://www.somosecooa.com.br/profissionais/' + encodeURIComponent(profSlug) + '" style="display:inline-block;margin-top:4px;padding:6px 14px;background:transparent;color:#7a8a7f;text-decoration:none;border:1px solid #7a8a7f;border-radius:4px;font-size:12px">ver perfil do profissional</a>';
    body += '</div>';
  }

  if (data.whatsapp) {
    const cleanPhone = String(data.whatsapp).replace(/\D/g, '');
    const waPhone = cleanPhone.indexOf('55') === 0 ? cleanPhone : '55' + cleanPhone;
    body += '<a href="https://wa.me/' + encodeURIComponent(waPhone) + '" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#25D366;color:white;text-decoration:none;border-radius:6px;font-size:14px">Responder pelo WhatsApp</a>';
  }

  body += '</div></div>';

  GmailApp.sendEmail(EMAIL_TO, subject, '', { htmlBody: body });
}

// ============================================================
// FOLLOW-UP AUTOMATION
// ============================================================
//
// Registra cada lead de conversão em uma aba dedicada "followUp" para que
// a equipe possa acompanhar pendências sem misturar com a aba principal.
// Um trigger time-driven (checkFollowUps) varre pendências vencidas e envia
// lembrete para ecooa.adm@gmail.com.
//
// Setup do trigger (manual, via editor GAS):
//   1. Abrir o editor de Apps Script
//   2. Clock icon (Triggers) > + Add Trigger
//   3. Function: checkFollowUps
//   4. Event source: Time-driven
//   5. Type: Hour timer, cada 2 horas
//   6. Save

const FOLLOWUP_SHEET = 'followUp';
const FOLLOWUP_DUE_HOURS = 2;

function logFollowUp(formType, data, timestamp) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return;

  let sheet = ss.getSheetByName(FOLLOWUP_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(FOLLOWUP_SHEET);
    const headers = ['Criado em', 'Tipo', 'Nome', 'WhatsApp', 'Profissional Recomendado', 'Intent', 'Status', 'Prazo', 'Notificado em'];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  const name = data.name || data.nome || '';
  const whatsapp = data.whatsapp || '';
  const prof = data.matchProfessional ? resolveProfessionalName(data.matchProfessional) : '';
  const intent = data.matchIntent || '';
  const dueDate = new Date(Date.now() + FOLLOWUP_DUE_HOURS * 60 * 60 * 1000);
  const dueFormatted = dueDate.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  sheet.appendRow([timestamp, formType, name, whatsapp, prof, intent, 'Pendente', dueFormatted, '']);
}

// Trigger target. Scans the followUp sheet for overdue "Pendente" rows and
// sends a single digest email to the team. Marks each scanned row with the
// notification timestamp to avoid duplicate alerts.
function checkFollowUps() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return;

  const sheet = ss.getSheetByName(FOLLOWUP_SHEET);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return; // Only headers

  const now = new Date();
  const overdue = [];
  const rowsToMark = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = String(row[6] || '');
    const dueStr = String(row[7] || '');
    const notifiedAt = String(row[8] || '');

    if (status !== 'Pendente' || notifiedAt) continue;

    // Parse Brazilian format "dd/mm/yyyy, HH:MM:SS"
    const due = parseBrDate(dueStr);
    if (!due || now < due) continue;

    overdue.push({
      createdAt: row[0],
      type: row[1],
      name: row[2],
      whatsapp: row[3],
      professional: row[4],
      intent: row[5],
    });
    rowsToMark.push(i + 1); // 1-indexed sheet row
  }

  if (overdue.length === 0) return;

  sendFollowUpReminder(overdue);

  // Mark rows as notified
  const nowFormatted = now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  rowsToMark.forEach(function(rowIdx) {
    sheet.getRange(rowIdx, 9).setValue(nowFormatted);
  });
}

function parseBrDate(str) {
  // Expected: "dd/mm/yyyy, HH:MM:SS" or "dd/mm/yyyy HH:MM:SS"
  const match = String(str).match(/(\d{2})\/(\d{2})\/(\d{4})[, ]\s*(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return null;
  return new Date(
    parseInt(match[3], 10),
    parseInt(match[2], 10) - 1,
    parseInt(match[1], 10),
    parseInt(match[4], 10),
    parseInt(match[5], 10),
    parseInt(match[6] || '0', 10)
  );
}

function sendFollowUpReminder(items) {
  const subject = 'ecooa | ' + items.length + ' lead' + (items.length > 1 ? 's' : '') + ' sem follow-up';

  let body = '<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">';
  body += '<div style="background:#c44;color:white;padding:16px 20px;border-radius:6px 6px 0 0">';
  body += '<h2 style="margin:0;font-size:16px;font-weight:400">Leads pendentes de follow-up</h2>';
  body += '</div>';
  body += '<div style="background:#fff;border:1px solid #e5e1dc;border-top:0;border-radius:0 0 6px 6px;padding:20px">';
  body += '<p style="margin:0 0 16px;font-size:13px;color:#666">Estes leads chegaram há mais de ' + FOLLOWUP_DUE_HOURS + 'h e ainda constam como Pendente.</p>';

  items.forEach(function(item) {
    body += '<div style="padding:12px 0;border-top:1px solid #eee">';
    body += '<p style="margin:0 0 4px;font-size:14px;color:#1a1a1a"><strong>' + escapeHtml(item.name || '-') + '</strong> <span style="color:#999;font-size:12px">(' + escapeHtml(item.type) + ')</span></p>';
    body += '<p style="margin:0 0 4px;font-size:13px;color:#666">WhatsApp: ' + escapeHtml(item.whatsapp || '-') + '</p>';
    if (item.professional) {
      body += '<p style="margin:0;font-size:12px;color:#7a8a7f">Recomendado: ' + escapeHtml(item.professional) + ' (' + escapeHtml(item.intent || 'busca livre') + ')</p>';
    }
    body += '</div>';
  });

  body += '</div></div>';

  GmailApp.sendEmail(EMAIL_TO, subject, '', { htmlBody: body });
}

// ============================================================
// NEWSLETTER DIGEST (P8.3)
// ============================================================
//
// Gera um draft de newsletter com os 3 posts mais recentes do blog, enviando
// como email para ecooa.adm@gmail.com para revisão e envio manual.
// NÃO envia direto aos subscribers (team mantém controle final).
//
// Setup do trigger (manual, via editor GAS):
//   1. Triggers > + Add Trigger
//   2. Function: generateNewsletterDigest
//   3. Event source: Time-driven
//   4. Type: Week timer, every 2 weeks, Monday, 09:00
//   5. Save

const NEWSLETTER_RSS_URL = 'https://www.somosecooa.com.br/rss.xml';

function generateNewsletterDigest() {
  try {
    const response = UrlFetchApp.fetch(NEWSLETTER_RSS_URL, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) {
      console.error('RSS fetch failed:', response.getResponseCode());
      return;
    }

    const xml = response.getContentText();
    const posts = parseRssLatest(xml, 3);
    if (posts.length === 0) {
      console.log('No posts found in RSS');
      return;
    }

    const subscriberCount = getNewsletterSubscriberCount();
    const body = buildNewsletterBody(posts, subscriberCount);
    const subject = 'ecooa | draft newsletter — ' + new Date().toLocaleDateString('pt-BR');

    GmailApp.sendEmail(EMAIL_TO, subject, '', { htmlBody: body });
  } catch (err) {
    console.error('generateNewsletterDigest error:', err);
  }
}

function parseRssLatest(xml, limit) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
    const block = match[1];
    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link');
    const description = extractTag(block, 'description');
    const pubDate = extractTag(block, 'pubDate');
    if (title && link) {
      items.push({ title: title, link: link, description: description, pubDate: pubDate });
    }
  }
  return items;
}

function extractTag(xml, tag) {
  const re = new RegExp('<' + tag + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + tag + '>');
  const match = xml.match(re);
  if (!match) return '';
  let content = match[1].trim();
  // Strip CDATA wrapper
  content = content.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
  return content;
}

function getNewsletterSubscriberCount() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return 0;
    const sheet = ss.getSheetByName('newsletter');
    if (!sheet) return 0;
    return Math.max(0, sheet.getLastRow() - 1); // minus header row
  } catch (err) {
    return 0;
  }
}

function buildNewsletterBody(posts, subscriberCount) {
  let body = '<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">';
  body += '<div style="background:#1a1a1a;color:white;padding:20px;border-radius:6px 6px 0 0">';
  body += '<h2 style="margin:0;font-size:18px;font-weight:400">draft newsletter — ecooa</h2>';
  body += '<p style="margin:6px 0 0;font-size:12px;opacity:.6">' + subscriberCount + ' inscritos ativos</p>';
  body += '</div>';
  body += '<div style="background:#f9f8f6;padding:24px;border:1px solid #e5e1dc;border-top:0;border-radius:0 0 6px 6px">';
  body += '<p style="margin:0 0 20px;font-size:13px;color:#666">Últimos 3 posts publicados. Revise, ajuste copy de abertura, e envie manualmente aos inscritos.</p>';

  posts.forEach(function(post) {
    body += '<div style="padding:16px 0;border-top:1px solid #eee">';
    body += '<p style="margin:0 0 6px;font-size:15px;font-weight:500;color:#1a1a1a">' + escapeHtml(post.title) + '</p>';
    if (post.description) {
      const desc = post.description.replace(/<[^>]+>/g, '').substring(0, 180);
      body += '<p style="margin:0 0 8px;font-size:13px;color:#666;line-height:1.5">' + escapeHtml(desc) + '…</p>';
    }
    body += '<a href="' + escapeHtml(post.link) + '" style="font-size:12px;color:#7a8a7f;text-decoration:none">ler no site →</a>';
    body += '</div>';
  });

  body += '</div></div>';
  return body;
}
