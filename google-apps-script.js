// ============================================================
// ECOOA - Google Apps Script para formulários do site
// Recebe dados de 4 tipos de formulário, salva no Sheets
// e envia notificação por e-mail para ecooa.adm@gmail.com
// ============================================================

const EMAIL_TO = 'ecooa.adm@gmail.com';
const SHEET_NAME = 'ecooa-formularios';

function doPost(e) {
  try {
    const data = {};

    // Parse form data (application/x-www-form-urlencoded)
    if (e.parameter) {
      Object.keys(e.parameter).forEach(key => {
        data[key] = e.parameter[key];
      });
    }

    const formType = data._formType || 'desconhecido';
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // Salvar no Google Sheets
    saveToSheet(formType, data, timestamp);

    // Enviar e-mail de notificação
    sendNotification(formType, data, timestamp);

    // Retornar sucesso com redirect
    const redirectUrl = data._next || '';
    if (redirectUrl) {
      return HtmlService.createHtmlOutput(
        '<script>window.location.href="' + redirectUrl + '";</script>'
      );
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Formulário recebido com sucesso.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'online', service: 'ecooa-forms' }))
    .setMimeType(ContentService.MimeType.JSON);
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

  const subject = '🟢 ecooa | ' + (labels[formType] || 'Novo formulário');

  let body = '<div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto">';
  body += '<div style="background:#1a1a1a;color:white;padding:20px 24px;border-radius:8px 8px 0 0">';
  body += '<h2 style="margin:0;font-size:18px;font-weight:400">' + (labels[formType] || 'Formulário') + '</h2>';
  body += '<p style="margin:4px 0 0;font-size:12px;opacity:.6">' + timestamp + '</p>';
  body += '</div>';
  body += '<div style="background:#f9f8f6;padding:24px;border:1px solid #e5e1dc;border-top:0;border-radius:0 0 8px 8px">';

  const fieldLabels = {
    name: 'Nome', nome: 'Nome', whatsapp: 'WhatsApp', email: 'E-mail',
    interest: 'Interesse', area: 'Área de atuação', _source: 'Origem'
  };

  Object.keys(data).forEach(key => {
    if (key.startsWith('_') && key !== '_source') return;
    const label = fieldLabels[key] || key;
    body += '<p style="margin:0 0 12px"><strong style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:.05em">' + label + '</strong><br>';
    body += '<span style="font-size:15px;color:#1a1a1a">' + (data[key] || '-') + '</span></p>';
  });

  if (data.whatsapp) {
    const cleanPhone = (data.whatsapp || '').replace(/\D/g, '');
    const waPhone = cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone;
    body += '<a href="https://wa.me/' + waPhone + '" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#25D366;color:white;text-decoration:none;border-radius:6px;font-size:14px">Responder pelo WhatsApp</a>';
  }

  body += '</div></div>';

  GmailApp.sendEmail(EMAIL_TO, subject, '', { htmlBody: body });
}
