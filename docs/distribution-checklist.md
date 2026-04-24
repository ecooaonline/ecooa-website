# Checklist de Distribuição — Pós-publicação

Cada post publicado deve passar por esta lista. Distribuição é tão importante quanto produção. Sem distribuição, conteúdo bom não gera retorno.

---

## No dia da publicação

### Google Search Console
- [ ] Inspecionar a URL do novo post em https://search.google.com/search-console
- [ ] Solicitar indexação (acelera aparecimento no Google)

### Instagram (@somos.ecooa)
- [ ] Post no feed com imagem hero do artigo (formato 1:1 ou 4:5)
- [ ] Copy curta: headline + 1 insight + "link na bio"
- [ ] Story com swipe-up ou sticker de link
- [ ] Adicionar highlight permanente se o conteúdo for atemporal

### WhatsApp Status
- [ ] Status com imagem + título + link
- [ ] Se autor for profissional ativo, sugerir que ele também compartilhe no próprio WhatsApp

### Autor do post
- [ ] Avisar autor que o post foi ao ar
- [ ] Fornecer link limpo para compartilhar em redes pessoais

---

## Na próxima newsletter

- [ ] Incluir post na próxima edição da newsletter quinzenal
- [ ] O draft é gerado automaticamente via `generateNewsletterDigest()` no Google Apps Script
- [ ] Revisar draft que chega no inbox de `ecooa.adm@gmail.com` antes de enviar aos subscribers

---

## Semana 1 pós-publicação

- [ ] Verificar posição no Google Search Console (keyword principal do post)
- [ ] Conferir métricas no GA4:
  - Pageviews do post
  - Tempo médio na página (alvo: >2 min para posts longos)
  - Taxa de rejeição (alvo: <70%)
  - Scroll depth (alvo: 50%+ chega no final)
- [ ] Responder comentários no Instagram se houver

---

## Mês 1 pós-publicação

- [ ] Avaliar se o post rankou para a keyword alvo
- [ ] Se sim e subiu: replicar a estrutura em posts futuros
- [ ] Se não: revisar title/description/conteúdo. Atualizar `lastModified` no frontmatter e fazer push
- [ ] Considerar atualizar post com novas evidências se surgirem no meio do trimestre

---

## Distribuição B2B (posts relevantes)

Para posts que interessam a outros profissionais de saúde:

- [ ] Compartilhar no LinkedIn do Gustavo/Jessica
- [ ] Enviar em grupos profissionais relevantes (CRM local, grupos de nutrição esportiva, etc.)
- [ ] Marcar profissionais citados/colaboradores do post

---

## Arquivo de referência

Esta checklist é documentada também em `.github/workflows/content-notify.yml`, que dispara em cada push de novo post em `src/content/blog/` para servir como lembrete automático.

---

## Conformidade LGPD na newsletter

Toda newsletter enviada deve:

- [ ] Ter link de unsubscribe visível
- [ ] Identificar remetente (ecooa)
- [ ] Incluir endereço físico (Rua Mariante, 180, 9º andar, Porto Alegre)
- [ ] Link para política de privacidade
- [ ] Não comprar lista externa. Usar apenas os subscribers que se cadastraram via site.
