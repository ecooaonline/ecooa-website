# Release Checklist — ecooa-website

Checklist de validação manual após cada deploy em produção.
Execute em ordem. Tempo estimado: 5-10 minutos.

## Checklist básico (todo deploy)

- [ ] `https://www.somosecooa.com.br` carrega sem erro.
- [ ] Home renderiza: hero, CTAs, seções visíveis.
- [ ] Navegação principal funciona (mobile + desktop).
- [ ] Nenhum erro no console do browser (F12 → Console).

## Checklist por área modificada

### Formulários

- [ ] Formulário de agendamento: preencher e enviar (usar dados de teste).
- [ ] Formulário de contato: preencher e enviar.
- [ ] Newsletter: inserir e-mail e enviar.
- [ ] Confirmar que honeypot não bloqueia envio legítimo.
- [ ] Confirmar que resposta de confirmação aparece.

### Blog / conteúdo

- [ ] Post novo aparece na listagem `/blog`.
- [ ] Página do post abre corretamente.
- [ ] Autor e data visíveis.
- [ ] Imagem de capa carrega.

### Profissionais

- [ ] `/profissionais` lista todos os profissionais.
- [ ] Página individual de profissional abre sem 404.
- [ ] CTA WhatsApp presente e funcional.

### Match engine

- [ ] `/match` carrega.
- [ ] Busca retorna resultados para "emagrecer" e "ansiedade".

### Analytics / pixels

- [ ] GTM carrega após aceitar cookies.
- [ ] Meta Pixel carrega após aceitar cookies.
- [ ] Microsoft Clarity carrega após aceitar cookies.
- [ ] Cookie banner aparece em sessão limpa (aba anônima).

## Checklist de performance e segurança (a cada mudança relevante)

- [ ] PageSpeed Insights mobile ≥ 99.
- [ ] PageSpeed Insights desktop ≥ 99.
- [ ] `curl -I https://www.somosecooa.com.br` mostra os headers de segurança do Cloudflare.

## Se algo falhar

1. Identificar o commit problemático.
2. Executar rollback conforme `ROLLBACK.md`.
3. Registrar incidente em `AI_HANDOFF.md`.
