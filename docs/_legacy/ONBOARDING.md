# Welcome to ecooa

## How We Use Claude

Based on Claude's usage over the last 30 days (83 sessions):

Work Type Breakdown:
```
  Build Feature   ███████░░░░░░░░░░░░░  33%
  Plan & Design   ████░░░░░░░░░░░░░░░░  20%
  Debug & Fix     ███░░░░░░░░░░░░░░░░░  17%
  Write Docs      ██░░░░░░░░░░░░░░░░░░  12%
  Improve Quality ██░░░░░░░░░░░░░░░░░░  10%
```

Top Skills & Commands:
```
  /model             ████████████████████  92x/month
  /PROTOCOLO-SITE    ██░░░░░░░░░░░░░░░░░░  skill
  /review            █░░░░░░░░░░░░░░░░░░░  skill
  /security-review   █░░░░░░░░░░░░░░░░░░░  skill
  /simplify          █░░░░░░░░░░░░░░░░░░░  skill
```

Top MCP Servers:
```
  (nenhum configurado — o projeto roda 100% self-hosted, sem dependências externas)
```

## Your Setup Checklist

### Codebases
- [ ] **ecooa-website** — `github.com/ecooaonline/ecooa-website` — Site Astro 6 estático, TypeScript strict, deploy via GitHub Pages

### MCP Servers to Activate
- Nenhum necessário. O projeto foi desenhado para zero dependências externas. Toda engine (match, analytics, forms) roda self-hosted.

### Skills to Know About
- `/model` — Troca entre modelos Claude (Opus, Sonnet, Haiku). O time usa Opus 4.7 como padrão para tarefas complexas de codificacao e auditoria. Usada 92x no ultimo mes.
- `/PROTOCOLO-SITE` — Skill customizada: roteiro completo de construcao de sites premium. Usa quando for replicar a arquitetura da ecooa para outros projetos.
- `/review` — Revisao de pull requests. Usa antes de dar merge.
- `/security-review` — Auditoria de seguranca do branch atual. Roda antes de deploys criticos.
- `/simplify` — Revisa codigo alterado buscando reuso, qualidade e eficiencia.

### Stack para Conhecer
- **Astro 6** — Framework SSG. Build com `npm run build`, dev com `npm run dev`.
- **TypeScript strict** — Sem `any`, sem `ts-ignore`.
- **GitHub Pages** — Deploy automatico via merge na main.
- **Formspree/Google Apps Script** — Backend dos formularios.
- **GTM + Meta Pixel** — Analytics com consent-gate (LGPD).
- **ecooa.match** — Engine de triagem semantica proprietaria (TF-IDF + 150 synonym clusters + 38 curated intents). Arquivo core: `src/scripts/match-engine.ts`.

### Regras do Projeto (CLAUDE.md)
- Sempre responder em **portugues brasileiro (pt-BR)**.
- **Sem em-dash** (—). Usar ponto ou virgula.
- **Fontes self-hosted** apenas. Sem Google Fonts externo.
- **Acentos obrigatorios** no conteudo.
- Labels de navegacao sao **lowercase** (identidade da marca).
- Categorias do blog **sem acento**: `medicina`, `estetica`, `nutricao`, `saude-mental`, `longevidade`, `ecooa`.

## Team Tips

_TODO_

## Get Started

_TODO_

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->
