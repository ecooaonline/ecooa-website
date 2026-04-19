# 🚀 SETUP — Claude Projects (ecooaonline/ecooa-website)

**Status**: Pronto para upload  
**Data**: 2026-04-19

---

## 📦 Arquivos para Fazer Upload

Todos em `.claude/` diretório:

1. **RELATORIO-TECNICO-IMPLEMENTACAO.md** (596L)
   - Relatório técnico completo P0-P5
   - Métricas, impacto, roadmap P6-P9

2. **README-OPERACIONAL.md** (400L)
   - Stack, setup, fluxos, deploy/rollback
   - Responsáveis e decisões técnicas

3. **PROJECT-MANIFEST.md** (atualizado, ~300L)
   - Sistema de cache e atualização
   - Protocolo semanal/mensal
   - TECH-RADAR integrado

4. **TECH-RADAR.md** (189L)
   - Detecção semanal/mensal/trimestral/anual
   - Critérios de alerta (4 níveis)
   - Checklist automático

5. **TECH-RADAR-LOG.md** (append-only)
   - Registro de tecnologias detectadas
   - Histórico de decisions

6. **CLAUDE.md** (42L)
   - Instruções do projeto (stack, regras, idioma)

---

## 🔧 Próximos Passos

### Passo 1: Upload para Claude Projects
1. Ir para https://claude.ai/projects
2. Criar novo projeto: "ecooa-website-cache"
3. Upload dos 6 arquivos acima
4. Definir PROJECT-MANIFEST.md como "primary document"

### Passo 2: Configurar Instrução Custom
Cole este prompt na instrução do projeto:

```
Você é assistente para ecooa-website, um site médico em Astro/TypeScript.

# Contexto Cached (não contar contra limite)
[Upload dos 6 arquivos via Claude Projects]

# Regras Operacionais
1. Responder em português brasileiro
2. Seguir stack: Astro 6, TypeScript 5, Google Apps Script, Vercel
3. Sem em-dash (—), sem Google Fonts externas
4. Labels navigation são lowercase intencionalmente
5. Category values: sem acento (medicina, estetica, nutricao, saude-mental, longevidade)

# Fluxo de Sessão
- Início: Ler PROJECT-MANIFEST para context
- Semanal: 1 min TECH-RADAR check (npm outdated, releases, CVEs)
- Mensal: 5 min TECH-RADAR consolidation
- Commit: Auto-update TECH-RADAR-LOG se houver alerts
- Batch: A cada 4 semanas, considerar update de manifest no projeto

# Eficiência
- Usar cached documents sempre (economia ~8K tokens/mês)
- Zero discussões sobre stack (já decidido)
- Foco em implementação e conformidade
```

### Passo 3: Validar Setup
```bash
# Verificar que files estão em cache
# (Claude Projects mostrará em painel)

# Próxima sessão, começa com leitura leve do PROJECT-MANIFEST
# para confirmar updates desde última sessão
```

---

## 📊 Expectativas de Economia

| Sessão | Sem Projeto | Com Projeto | Economia |
|--------|------------|------------|----------|
| Leitura docs | 800 tokens | 150 tokens | **-650** |
| Setup context | 300 tokens | 50 tokens | **-250** |
| **Por sessão** | **1,100** | **200** | **-900** |
| Mensal (3 sess) | 3,300 | 600 | **-2,700** |

---

## ✅ Checklist Final

```
[ ] Upload de 6 arquivos para Claude Projects
[ ] Validar que todos aparecem em "cached documents"
[ ] Testar novo projeto com prompt customizado
[ ] Proxima sessão: começar com "git status && TECH-RADAR check"
[ ] Depois de 1 mês: revisar economia real vs estimado
```

---

## 🎯 Impacto Esperado

✅ **Zero latência** de onboarding em novas sessões  
✅ **~8K tokens/mês economizados** em leitura de docs  
✅ **Detecção automática** de tech changes  
✅ **Documentação viva** (TECH-RADAR-LOG cresce com tempo)  
✅ **Histórico auditável** de decisions (Git + PROJECT-MANIFEST)

---

**Status**: 🟢 Pronto para produção. Falta apenas upload para Claude Projects.
