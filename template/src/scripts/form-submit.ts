const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;
const TIMEOUT_MS = 15000;

async function postForm(url: string, data: FormData, attempt = 0): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, { method: 'POST', body: data, signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok && attempt < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
      return postForm(url, data, attempt + 1);
    }
    return res;
  } catch (err) {
    clearTimeout(timeout);
    if (attempt < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
      return postForm(url, data, attempt + 1);
    }
    throw err;
  }
}

document.querySelectorAll<HTMLFormElement>('.ecooa-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'enviando...'; }

    const data = new FormData(form);
    const formType = data.get('_formType') as string || 'unknown';
    const matchProf = data.get('matchProfessional') as string || '';

    try {
      await postForm(form.action, data);

      // Analytics
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'form_submit_success', { event_label: formType });
      }

      const conversionTypes = ['agendamento', 'b2b-medicina', 'b2b-nutricao'];
      if (conversionTypes.includes(formType)) {
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
        const redirectUrl = `/obrigado?type=${formType}${matchProf ? `&profissional=${matchProf}` : ''}`;
        window.location.href = redirectUrl;
        return;
      }

      if (formType === 'newsletter') {
        if (typeof window.fbq === 'function') window.fbq('track', 'Subscribe');
      }

      form.style.display = 'none';
      const ok = form.parentElement?.querySelector<HTMLElement>('.ecooa-form-ok');
      if (ok) ok.style.display = 'block';

    } catch (err) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'form_submit_error', { event_label: String(err) });
      }
      if (btn) {
        btn.textContent = 'erro, tente novamente';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = 'enviar'; }, 4000);
      }
    }
  });
});
