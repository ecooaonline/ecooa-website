# ROLLBACK.md — Reversão e incidentes do ecooa-website

> Produzido pelo P03 (2026-06-12) para a plataforma oficial (Cloudflare Workers Static
> Assets). Substitui operacionalmente o ROLLBACK.md da raiz (era GitHub Pages); o da
> raiz será atualizado como espelho no P13. Como acessar: painel → Workers →
> ecooa-website → **Deployments/Versions** (histórico completo; cada deploy é uma
> versão imutável).

## Mecanismos de reversão (do mais rápido ao mais profundo)

1. **Rollback de plataforma**: Deployments → versão anterior → *Rollback* (segundos;
   não exige build). Quem: dono (painel) ou IA via wrangler com autorização.
2. **Revert de git**: `git revert <sha>` + merge → Workers Builds rebuilda (~2-4 min).
3. **Cutover reverso (catástrofe de migração)**: remover Custom Domain do Worker e
   repontar `www` ao GitHub Pages (enquanto o Pages não for desativado — por isso a
   espera de 24-48h no DEPLOYMENT §10.5).

## Os 15 cenários

| Cenário | Detectar | Reverter | Quem | Tempo | Validar | Prevenir |
|---|---|---|---|---|---|---|
| Deploy com erro | smoke test/alertas P13 | rollback de versão | dono/IA | ~1 min | smoke §12 | CI bloqueante |
| Build quebrado | Workers Builds falha (produção continua na versão anterior) | corrigir e re-push | IA | n/a (sem downtime) | build verde | validate local |
| Domínio quebrado | site fora no www | reconferir Custom Domain; cutover reverso | dono | minutos | curl/PSI | checklist cutover |
| DNS errado | resolução falha | restaurar registro na zona (CF guarda histórico de auditoria) | dono | minutos | dig/navegador | mudanças só no cutover |
| SSL inválido | aviso de certificado | modo Full(strict)+Universal SSL rechecar | dono | minutos-1h | navegador | não tocar SSL fora do cutover |
| Página branca | smoke/uptime | rollback de versão | dono/IA | ~1 min | home 200 | testes P8 |
| Formulário quebrado | teste E2E/alertas | rollback; fallback WhatsApp segue ativo | IA | ~1 min | envio de teste | reteste a cada mudança do funil |
| Assets quebrados | console/visual | rollback | IA | ~1 min | visual | hash de assets já garante |
| Redirect errado | curl -I apex | corrigir `_redirects`/regra de zona | IA/dono | minutos | curl | revisão no PR |
| Cache indevido | conteúdo velho | purge de cache da zona (painel) + corrigir `_headers` | dono | minutos | hard reload | plano de cache P7 |
| SW antigo preso | usuários veem versão velha | bump `VERSION` no sw.js (deploy novo) | IA | 1 deploy | DevTools→Application | versionamento já praticado |
| CSP bloqueando | console errors pós-P7 | rollback de versão; revisar `_headers` | IA | ~1 min | console limpo | reteste obrigatório do funil (Anti-padrão 8) |
| Headers quebrando | comportamento anômalo | idem CSP | IA | ~1 min | curl -I | idem |
| Analytics quebrado | GA4 silencioso | rollback; revisar consent/gates | IA | ~1 min | evento de teste | P14 monitora |
| SEO bloqueado | GSC/queda | restaurar robots/headers; rollback | IA | ~1 min | robots 200, sem noindex indevido | gate do Contrato (P8) |

## Registro e prevenção

Todo incidente: registrar data/causa/ação/tempo no PR ou em `docs/` (P13 define o local
definitivo de log de incidentes) e criar prevenção (teste/gate) quando padrão se repetir.
