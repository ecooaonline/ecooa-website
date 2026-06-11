// Submit handler central para formulários do ecooa.
//
// Formulários de CONVERSÃO (agendamento, contato, b2b-medicina, b2b-nutricao):
// submissão NATIVA para o Google Apps Script com `_next` apontando para
// /obrigado. O GAS só emite o redirect depois de validar e gravar o lead,
// então chegar em /obrigado é confirmação REAL do servidor — sem `no-cors`
// cego nem sucesso por timeout. O evento de conversão dispara na própria
// página de obrigado (com token anti-duplicação).
//
// Newsletter: permanece com fetch em `no-cors` e feedback inline otimista.
// Risco aceito e documentado na auditoria (P00/CP-01): inscrição de baixo
// impacto não justifica navegação de página.
//
// Uso: adicione a classe .ecooa-form ao <form>. Newsletter precisa de um
// <p class="ecooa-form-ok"> irmão (ou data-ok-target) para a mensagem.

const TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;
const MIN_FILL_MS = 2000;
const CONVERSION_FORMS = ['agendamento', 'contato', 'b2b-medicina', 'b2b-nutricao'];

type BindableForm = HTMLFormElement & { _ecooaBound?: boolean };

function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFormType(form: HTMLFormElement): string {
  return (form.querySelector<HTMLInputElement>('[name="_formType"]')?.value || 'unknown').trim();
}

function findOkEl(form: HTMLFormElement): HTMLElement | null {
  const okSelector = form.dataset.okTarget || '.ecooa-form-ok';
  return (
    form.parentElement?.querySelector<HTMLElement>(okSelector) ??
    document.querySelector<HTMLElement>(okSelector)
  );
}

function showInlineSuccess(form: HTMLFormElement): void {
  const okEl = findOkEl(form);
  form.style.display = 'none';
  if (okEl) {
    okEl.textContent = form.dataset.successText || 'Recebido. Retornaremos em breve.';
    okEl.style.display = 'block';
  }
}

function pushDataLayer(payload: Record<string, unknown>): void {
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
}

// Anti-spam client-side compartilhado. Retorna true quando o envio deve ser
// cancelado silenciosamente (bot): exibe sucesso aparente sem entregar nada.
function isSpamSubmission(form: HTMLFormElement): boolean {
  const hp = form.querySelector<HTMLInputElement>('[name="_honeypot"]');
  if (hp && hp.value.trim() !== '') return true;
  const lt = form.querySelector<HTMLInputElement>('[name="_loadedAt"]');
  if (lt && lt.value && Date.now() - parseInt(lt.value, 10) < MIN_FILL_MS) return true;
  return false;
}

// ── Conversão: submit nativo com redirect confirmado pelo servidor ──
function bindConversionForm(form: HTMLFormElement): void {
  form.addEventListener('submit', (event) => {
    if (isSpamSubmission(form)) {
      event.preventDefault();
      showInlineSuccess(form);
      return;
    }

    const formType = getFormType(form);

    // Destino pós-gravação. O GAS valida o host (allowlist) antes de
    // redirecionar; o token `t` permite disparar a conversão uma única vez.
    const next = form.querySelector<HTMLInputElement>('[name="_next"]');
    if (next) {
      const qs = new URLSearchParams({ type: formType, t: String(Date.now()) });
      const matchProf =
        form.querySelector<HTMLInputElement>('[name="matchProfessional"]')?.value || '';
      if (matchProf) qs.set('profissional', matchProf);
      next.value = `${location.origin}/obrigado?${qs.toString()}`;
    }

    // Tentativa (não é conversão; o sucesso real dispara em /obrigado).
    pushDataLayer({ event: 'form_submit_attempt', form_type: formType });

    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'enviando...';
    }
    // Sem preventDefault: o POST nativo segue para o GAS, que responde com o
    // redirect para /obrigado somente após gravar o lead.
  });
}

// ── Newsletter: fetch inline otimista (risco aceito) ──
async function postForm(form: HTMLFormElement, attempt = 0): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // O Google Apps Script não envia Access-Control-Allow-Origin; em 'no-cors'
    // o POST é entregue mas a resposta volta opaca. Aceito apenas para a
    // newsletter; formulários de conversão usam submit nativo verificável.
    await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      mode: 'no-cors',
      signal: controller.signal,
    });
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      await waitFor(RETRY_DELAY_MS * (attempt + 1));
      return postForm(form, attempt + 1);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function bindNewsletterForm(form: HTMLFormElement): void {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isSpamSubmission(form)) {
      showInlineSuccess(form);
      return;
    }

    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const originalLabel = btn?.textContent || '';
    if (btn) {
      btn.textContent = 'enviando...';
      btn.disabled = true;
    }

    try {
      await postForm(form);
      pushDataLayer({ event: 'newsletter_subscribe', form_type: 'newsletter' });
      window.fbq?.('track', 'Subscribe');
      showInlineSuccess(form);
    } catch (err) {
      if (btn) {
        btn.textContent = originalLabel;
        btn.disabled = false;
      }
      const errorEl = form.parentElement?.querySelector<HTMLElement>('.ecooa-form-error');
      if (errorEl) {
        errorEl.textContent = form.dataset.errorText || 'erro. tente novamente';
        errorEl.style.display = 'block';
        setTimeout(() => {
          errorEl.style.display = 'none';
        }, 5000);
      }
      window.gtag?.('event', 'form_submit_error', {
        event_category: 'conversion',
        event_label: String((err as Error).message || 'unknown'),
      });
    }
  });
}

export function initFormSubmit(selector = '.ecooa-form'): void {
  document.querySelectorAll<HTMLFormElement>(selector).forEach((form) => {
    const bindable = form as BindableForm;
    if (bindable._ecooaBound) return;
    bindable._ecooaBound = true;

    const loadedAtField = form.querySelector<HTMLInputElement>('[name="_loadedAt"]');
    if (loadedAtField && !loadedAtField.value) loadedAtField.value = String(Date.now());

    if (CONVERSION_FORMS.indexOf(getFormType(form)) !== -1) {
      bindConversionForm(form);
    } else {
      bindNewsletterForm(form);
    }
  });
}
