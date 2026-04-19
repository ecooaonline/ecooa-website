# 📊 PROJECT MANIFEST — ecooa-website

**Última atualização**: 2026-04-30  
**Próxima revisão**: 2026-05-07 (semanal)

---

## 📁 Arquivos no Projeto Claude (CACHE)

| Arquivo | Versão | Linhas | Hash | Status |
|---------|--------|--------|------|--------|
| `RELATORIO-TECNICO-IMPLEMENTACAO.md` | 1.2 | 596 | `7a2f9c` | ✅ Ativo |
| `README-OPERACIONAL.md` | 1.1 | 400 | `5e8a1b` | ✅ Ativo |
| `docs/P3-P5-COMPLETO.md` | 1.0 | 267 | `3c4d2e` | ✅ Ativo |
| `PROMPT-APRESENTACAO-IA.md` | 1.0 | 126 | `9f1a2b` | ✅ Ativo |
| `CLAUDE.md` | 2.0 | 42 | `8b3c4d` | ✅ Ativo |
| `TECH-RADAR.md` | 1.0 | 189 | `a4f5e2` | ✅ Ativo |
| `TECH-RADAR-LOG.md` | 1.0 | 49 | `b6c7d3` | ✅ Ativo |

**Total em Cache**: 1,669 linhas (não contam contra limite)

---

## 🔄 PROTOCOL DE ATUALIZAÇÃO (ZERO OVERHEAD)

### Gatilhos automáticos:
1. **Commit no repositório** → Verificar se arquivo no manifest mudou
2. **Se mudou** → Adicionar nota em `UPDATES-LOG.md` (este arquivo)
3. **A cada 7 dias** → Revisar log e fazer batch-update do projeto
4. **TECH-RADAR checks** → Scan semanal (CVE, breaking changes), mensal (tendências), trimestral (compliance), anual (arquitetura)

### Exemplo de detecção (bash):
```bash
# Rodar monthly ou no CI/CD
git diff HEAD~1 RELATORIO-TECNICO-IMPLEMENTACAO.md && echo "UPDATE-NEEDED"
```

### TECH-RADAR Integrado:
- **Semanal (1 min)**: npm outdated, GitHub releases, Google deprecations
- **Mensal (5 min)**: Consolidar insights, tendências em SSG/analytics
- **Trimestral**: Conformidade (WCAG, CFM, LGPD)
- **Anual**: Revisão arquitetural completa
- **Log**: `TECH-RADAR-LOG.md` (append-only, auto-append quando encontrar alerts)

---

## 📝 UPDATES LOG

### 2026-04-30
- ✅ Criado projeto Claude inicial
- ✅ Upload: RELATORIO (596L), README (400L), P3-P5 (267L), PROMPT (126L)
- ✅ Teste de cache: OK (todos os arquivos em cache, não contam limite)

### 2026-05-07 (Planejado)
- [ ] Revisar se houve mudanças nos arquivos
- [ ] Se sim: fazer batch-update
- [ ] Se não: skip (economia de tokens)

---

## 💡 MÉTODO DE UPDATE EFICIENTE

### Quando NÃO fazer update (economiza):
- Erros tipográficos pequenos → documentar em issue, não upload
- Mudanças <5% do conteúdo → documentar em changelog local
- Testes/experimentações → não fazer upload

### Quando FAZER update (justifica upload):
- ✅ Novo P (P6, P7) implementado (>200 linhas)
- ✅ Mudança arquitetural (altifica fluxo do projeto)
- ✅ Correção de divergência comprovada (como foi feito agora)
- ✅ Atualização de stack/tecnologias

---

## 📊 MÉTRICAS DE CACHE (PRÓ-FORMA)

Estimativa semanal (assumindo 3 sessões/semana):

| Métrica | Sem Projeto | Com Projeto | Economia |
|---------|------------|------------|----------|
| Tokens/sessão (leitura docs) | 800 | 150 | **650 tokens** |
| Sessões/semana | 3 | 3 | — |
| **Economia semanal** | — | — | **1,950 tokens** |
| **Economia mensal** | — | — | **~8,000 tokens** |

---

## ✅ CHECKLIST SEMANAL (3 min)

```
SEGUNDA (início de sprint):
[ ] npm outdated | grep critical? (TECH-RADAR semanal)
[ ] GitHub releases: astro, typescript? (TECH-RADAR)
[ ] Houve commits no repo (git log)?
[ ] Algum arquivo do manifest foi alterado?
    [ ] RELATORIO-TECNICO?
    [ ] README-OPERACIONAL?
    [ ] Outros docs?
[ ] Se SIM em qualquer item: marcar em UPDATES-LOG
[ ] Se NÃO: skip até próxima semana

A CADA 4 SEMANAS:
[ ] Batch-update do projeto (se necessário)
[ ] TECH-RADAR mensal (5 min checklist adicional)
```

---

**Próximo update**: 2026-05-07 (se houver mudanças)
