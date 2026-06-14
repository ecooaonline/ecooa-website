# PENDENCIAS_FINAIS — Dossiê de pendências do dono

> Fase: P13 (MYTHOS). Data: 2026-06-14. Cada item é **físico do painel/conta/DNS** —
> território do dono (Lei da Fronteira), fora do alcance da IA. Cada um com o que é, por
> que importa, risco, passo a passo e como verificar. O P15 herda este dossiê.

## PEND-01 — Teste E2E do formulário em produção (HIP-09) · gate do P04
- **O que:** enviar um lead de teste real em produção e confirmar que ele **chega ao
  destino** (`DESTINO_LEADS`).
- **Por que/risco:** a IA não acessa o destino; sem isso, uma quebra do funil seria
  silenciosa (perda invisível de lead — o pecado capital, Lei 5).
- **Passos:** abrir `/agendamento` em produção → enviar com nome "TESTE [data]" →
  confirmar redirect a `/obrigado` → conferir o lead no destino. Repetir teste de erro
  (rede off): sem redirect de sucesso, fallback WhatsApp visível.
- **Verificar:** lead presente no destino; registrar data em `INTEGRATIONS.md` §7.

## PEND-02 — Trigger de conversão no GTM (PROM-10)
- **O que:** criar no container GTM um trigger de evento personalizado
  `form_submit_success` → tag de conversão GA4/Ads.
- **Por que:** a página já empurra o evento no dataLayer; falta a tag no painel para a
  conversão contar. **Print do estado atual do GTM antes** (a interface muda — Lei 36).
- **Verificar:** GTM Preview mostra a tag disparando em `/obrigado`.

## PEND-03 — Revisão jurídica (CFM/YMYL)
- **O que:** revisor jurídico avaliar exibição de `aggregateRating`/depoimentos e claims
  de serviço (medicina/estética/saúde mental). Insumo: `_legacy/CONFORMIDADE-MEDICA-P0.md`
  (matriz de 15 claims) + `SEO_GUIDE.md` §4 + `DATA_GOVERNANCE.md` §6.
- **Risco:** publicidade médica fora das normas do CFM.
- **Revisor:** a definir pelo dono. **Prazo:** a definir.

## PEND-04 — Cutover Cloudflare Workers Static Assets (destrava P07 e PROM-06)
- **O que:** criar o Worker, conectar o repo, apontar DNS, ativar. Destrava: headers/HSTS/
  CSP reais (`SECURITY.md`), cache imutável (`PERFORMANCE_BUDGET`), 301 dos slugs legados
  (PROM-06), noindex de preview (PROM-01).
- **Risco:** MX intocável (e-mail do domínio); SSL Full(strict); não usar Flexible.
- **Passos:** ver `DEPLOYMENT.md` §5 + `INFRASTRUCTURE.md`. **Não submeter HSTS preload
  pela IA** (porta de mão única — decisão consciente do dono).
- **Verificar (pós-cutover):** `curl -I` com headers; `securityheaders.com` A+; Protocolo
  de Teste do P04 re-executado; Lighthouse sem regressão.

## PEND-05 — Search Console (P10)
- **O que:** verificar a propriedade `www.somosecooa.com.br`, enviar o sitemap, inspecionar
  2-3 URLs. Valida HIP-05/06/10 (keywords reais).
- **Verificar:** sitemap aceito; cobertura sem erros.

## PEND-06 — Contas de aquisição (P14)
- **O que:** GA4/GTM/Meta Pixel/Google Ads — confirmar posse (conta compartilhada? qual
  recurso é do projeto?) e criar a ação de conversão DO projeto (não reusar a do vizinho).
  **Mapa de posse antes de qualquer clique** (Lei 36; o quase-incidente real desta esteira).
- **Verificar:** conversão do projeto isolada; vizinhos intocados.

## PEND-07 — Repositório / branch protection
- **O que:** confirmar branch protection da `main` (required checks: Quality Gates,
  Lighthouse, CodeQL) e ligar "Allow GitHub Actions to create and approve pull requests"
  (Settings → Actions → General) para o job `open-pr` parar de falhar.
- **Risco:** baixo (cosmético/processo).

## PEND-08 — Teste com leitor de tela (P09)
- **O que:** executar o roteiro de `ACCESSIBILITY_CHECKLIST.md` §6 (NVDA/VoiceOver/TalkBack).
- **Verificar:** cada passo anuncia o esperado.
