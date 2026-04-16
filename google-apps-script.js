// ============================================================
// ECOOA - Google Apps Script para formulários do site
// Recebe dados de 4 tipos de formulário, salva no Sheets
// e envia notificação por e-mail para ecooa.adm@gmail.com
// ============================================================

const EMAIL_TO = 'ecooa.adm@gmail.com';
const SHEET_NAME = 'ecooa-formularios';

// Segurança
const ALLOWED_FORM_TYPES = ['agendamento', 'b2b-medicina', 'b2b-nutricao', 'newsletter'];
const ALLOWED_REDIRECT_HOSTS = ['ecooa.com.br', 'www.ecooa.com.br', 'ecooaonline.github.io'];
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
      return ['Data/Hora', 'Nome', 'WhatsApp', 'Interesse', 'Status'];
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
      return [timestamp, data.name || '', data.whatsapp || '', data.interest || '', 'Novo'];
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

  Object.keys(data).forEach(function(key) {
    if (key.charAt(0) === '_' && key !== '_source') return;
    const label = fieldLabels[key] || key;
    body += '<p style="margin:0 0 12px"><strong style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:.05em">' + escapeHtml(label) + '</strong><br>';
    body += '<span style="font-size:15px;color:#1a1a1a">' + escapeHtml(data[key] || '-') + '</span></p>';
  });

  if (data.whatsapp) {
    const cleanPhone = String(data.whatsapp).replace(/\D/g, '');
    const waPhone = cleanPhone.indexOf('55') === 0 ? cleanPhone : '55' + cleanPhone;
    body += '<a href="https://wa.me/' + encodeURIComponent(waPhone) + '" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#25D366;color:white;text-decoration:none;border-radius:6px;font-size:14px">Responder pelo WhatsApp</a>';
  }

  body += '</div></div>';

  GmailApp.sendEmail(EMAIL_TO, subject, '', { htmlBody: body });
}
