// Submit handler central para formulários do ecooa.
// Uso: adicione a classe .ecooa-form ao <form> e um <p class="ecooa-form-ok"> irmão para mensagem de sucesso.
// Campos especiais (opcional):
//   - data-success-text: texto a exibir em caso de sucesso
//   - data-error-text:   texto a exibir em caso de erro
//   - data-ok-target:    selector alternativo para o elemento de sucesso (padrão: .ecooa-form-ok irmão)

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postForm(form: HTMLFormElement, attempt = 0): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
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

export function initFormSubmit(selector = '.ecooa-form'): void {
  document.querySelectorAll<HTMLFormElement>(selector).forEach((form) => {
    if ((form as any)._ecooaBound) return;
    (form as any)._ecooaBound = true;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const okSelector = form.dataset.okTarget || '.ecooa-form-ok';
      const okEl = form.parentElement?.querySelector<HTMLElement>(okSelector)
        ?? document.querySelector<HTMLElement>(okSelector);
      const successText = form.dataset.successText || 'Recebido. Retornaremos em breve.';
      const errorText = form.dataset.errorText || 'erro. tente novamente';
      const originalLabel = btn?.textContent || '';

      if (btn) {
        btn.textContent = 'enviando...';
        btn.disabled = true;
      }

      try {
        await postForm(form);
        form.style.display = 'none';
        if (okEl) {
          okEl.textContent = successText;
          okEl.style.display = 'block';
        }
        const formType = (form.querySelector('[name="_formType"]') as HTMLInputElement | null)?.value || 'unknown';
        window.gtag?.('event', 'form_submit_success', {
          event_category: 'conversion',
          event_label: formType,
        });
        // Meta Pixel: Lead para formulários de conversão, Subscribe para newsletter
        if (formType === 'newsletter') {
          window.fbq?.('track', 'Subscribe');
        } else if (formType === 'agendamento' || formType === 'b2b-medicina' || formType === 'b2b-nutricao') {
          window.fbq?.('track', 'Lead', { content_name: formType });
        }
      } catch (err) {
        if (btn) {
          btn.textContent = errorText;
          btn.disabled = false;
          setTimeout(() => { btn.textContent = originalLabel; }, 4000);
        }
        window.gtag?.('event', 'form_submit_error', {
          event_category: 'conversion',
          event_label: String((err as Error).message || 'unknown'),
        });
      }
    });
  });
}
