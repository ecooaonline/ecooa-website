# Arquitetura unificada de execução da esteira Mythos

> Documento de arquitetura, não de execução. Define como as 20 skills Mythos se
> encadeiam, se paralelizam e se travam no repositório real do ecooa-website.
>
> Criado em 2026-08-01, na sessão autônoma pedida pelo dono, com ele ausente da
> tela. Objetivo declarado: **ser inevitavelmente top1** em saúde, Porto Alegre,
> Moinhos de Vento.
>
> Fonte da verdade sobre o que está publicado: `docs/ESTADO-REAL.md`. Em conflito
> com qualquer outro documento de `docs/`, vale aquele. Este documento aqui
> governa **o processo**, não o produto.

---

## 0. O fato físico que reorganiza tudo

As 20 skills foram escritas presumindo um projeto com framework, build que gera
páginas, backend de formulário e CMS. O ecooa não tem nada disso. O que existe é:

```
src-site-3/*.html          templates do autor, com placeholders e blocos <x-dc>
        │
        ▼  scripts/gerar-site.mjs   (Chromium headless + python3 http.server:4390)
deploy/*.html              HTML congelado, sem eval, sem React
        │
        ▼  17 pós-processadores encadeados dentro do próprio gerar-site.mjs
deploy/                    63 arquivos HTML, 31 URLs no sitemap
        │
        ▼  npm run build  =  node scripts/build-site.mjs   (só COPIA)
dist/                      o que o gate valida e o que o Pages publica
```

Três consequências que valem para as 20 etapas, sem exceção:

1. **`npm run build` não constrói nada.** Ele copia `deploy/` para `dist/`. Toda
   skill que manda "rodar o build e contar as páginas geradas" está, aqui,
   contando arquivos commitados à mão. A contagem honesta é `find deploy -name
   '*.html' | wc -l` (63) cruzada com `grep -c '<loc>' deploy/sitemap.xml` (31).
2. **`deploy/*.html` é artefato gerado.** Editar à mão passa no gate e some na
   próxima geração. Toda correção nasce em `src-site-3/`, em
   `deploy/dados-ecooa.js` ou num pós-processador de `scripts/`.
3. **A regeneração está bloqueada agora.** `scripts/gerar-site.mjs`,
   `scripts/conversao.mjs` e `scripts/mobile.mjs` fazem
   `require('playwright')`, e `playwright` **não está em `node_modules` nem no
   `package-lock.json`**. Só existe `playwright-core` e o Chromium em
   `/opt/pw-browsers/chromium-1194`. Enquanto isso não for resolvido, a cadeia
   completa não roda.

### A divisão que salva o paralelismo

Dos 17 pós-processadores encadeados em `gerar-site.mjs`, **15 são transformações
puras de texto sobre `deploy/`** e rodam sozinhos, sem Chromium:

| Rodam sozinhos (Node puro) | Exigem Chromium |
| --- | --- |
| `nav-links` `menus` `mosaico` `match` `limpeza` `retoques` `areas` `artigos` `perfis` `estruturados` `acessibilidade` `redirects` `medicao` `personaliza` `sitemap` | `gerar-site` `conversao` `mobile` `captura-menus` `captura-modal` |

Isso significa que **o output pode ser levado ao verde sem regenerar a partir dos
templates**. É a diferença entre uma esteira travada e uma esteira que anda.

---

## 1. Mapa de dependências

### 1.1 O grafo real

```
                    ┌─────────── P00 auditoria (leitura) ───────────┐
                    ▼                                               ▼
              P01 estratégia                                  P17 ética (guarda)
                    │                                               │
        ┌───────────┼───────────┬──────────────┐                    │
        ▼           ▼           ▼              ▼                    │
   P02 arquit.  P03 infra   P05 fundação   P04 conversão            │
        │           │           │              │                    │
        │           │           │              ▼                    │
        │           │           │         P14 aquisição ◄───────────┤
        ▼           │           │              │                    │
   P10 SEO ◄────────┼───────────┘              │                    │
        │           │                          │                    │
        ▼           ▼                          ▼                    │
   P09 a11y    P07 segurança            EXTRA-GBP local             │
        │           │                          │                    │
        ▼           ▼                          │                    │
   P11 UI/DS   P06 performance ◄───────────────┘                    │
        │           │                                               │
        └─────┬─────┘                                               │
              ▼                                                     │
        P12 conteúdo ───────────────────────────────────────────────┤
              │                                                     │
              ▼                                                     ▼
        P08 CI/CD gates ◄─── converte TODA promessa em invariante ──┘
              │
              ▼
        P13 QA final ──► P15 manutenção ──► P16 revisor magno ──► P19 valor
```

### 1.2 Quem alimenta quem, com o artefato real

| Origem | Destino | O que passa | Onde vive no repo |
| --- | --- | --- | --- |
| P00 | P01 | inventário, riscos, mapa de preservação | `docs/P00_AUDITORIA.md` |
| P01 | P02, P04, P12 | definição de lead, persona, termos proibidos | `docs/ESTADO-REAL.md` §3 |
| P02 | P10, P09, P11 | Matriz de Páginas, Contrato de Páginas | `scripts/validate-output.mjs` bloco 1 |
| P03 | P07, P08 | plataforma, CSP, cache, rollback | `deploy/_headers`, `wrangler.jsonc` |
| P04 | P14, P07 | eventos, domínios de terceiros, fonte única | `scripts/conversao.mjs` |
| P05 | P08 | reprodutibilidade, lacunas de tooling | `package.json`, `.nvmrc` |
| P06 | P07, P08, P11 | budget, rito de regressão | `docs/mythos/baseline/performance.md` |
| P07 | P08, P14 | degrau de CSP, mapa de recursos | `deploy/_headers` |
| P09 | P08, P11 | invariantes de a11y | `scripts/acessibilidade.mjs` |
| P10 | P08, P12, GBP | schema, sitemap, títulos únicos | `scripts/estruturados.mjs`, `sitemap.mjs` |
| P11 | P12 | tokens, componentes, inventário visual | `src-site-3/`, `scripts/retoques.mjs` |
| P12 | P08, P17 | guardião calibrado, copy | `scripts/validate-output.mjs` bloco 6 |
| P14 | GBP, P15 | UTM, eventos, atribuição | `scripts/medicao.mjs` |
| P08 | todas | gate que impede regressão | `scripts/validate-output.mjs`, `.github/workflows/` |
| P13 | P15, P16 | painel da verdade, dossiê | `docs/mythos/` |
| P17 | todas | veto regulatório | poder de bloqueio, não artefato |

### 1.3 Os ciclos reais (e como quebrá-los)

Ciclo não é defeito de desenho. É consequência de o produto ser um só. O que
não pode existir é ciclo **não declarado**.

| Ciclo | Por que existe | Como se quebra |
| --- | --- | --- |
| **P02 ⇄ P10** | P02 declara o Contrato de Páginas, P10 descobre páginas que precisam existir (os 31 perfis) e muda a contagem | O Contrato vira **variável travada no gate**, não constante. Mudou a contagem, atualiza `ROTAS`/piso do sitemap em `validate-output.mjs` **na mesma entrega** |
| **P06 ⇄ P07** | Segurança adiciona header e script, performance cobra TBT e LCP | Ordem fixa: P06 mede, P07 endurece, P06 remede. O budget vence o selo |
| **P06 ⇄ P14** | Medição custa performance | `medicao.mjs` carrega o GTM só após o primeiro gesto ou 4s. Custo empurrado para fora do caminho crítico |
| **P09 ⇄ P11** | A11y pede contraste, UI protege a paleta | Correção de contraste sempre por **token contextual**, nunca pela paleta macro do `BRANDBOOK-ECOOA.md` |
| **P12 ⇄ P17** | Conteúdo escreve, ética veta | P17 roda **duas vezes**: como guarda antes (regras) e como veto depois (auditoria) |
| **P04 ⇄ P08** | Conversão define o crítico, gate trava o crítico | O bloco 3 de `validate-output.mjs` já é essa costura |

### 1.4 Onde uma etapa posterior invalida uma anterior

Isto é o mais perigoso, porque acontece em silêncio.

| Invalidação | Sintoma | Proteção |
| --- | --- | --- |
| **P10 invalida o Contrato do P02** | O sitemap passa de 31 para 62 URLs e o gate reprova por "motivo certo com número errado" | O piso do sitemap e a lista `ROTAS` são atualizados junto com o script que gerou as páginas |
| **P11 invalida o baseline do P06** | Muda CSS, o LCP muda, e o "antes x depois" do P06 vira comparação de sites diferentes | Rito de regressão: qualquer wave que toque CSS remede as páginas críticas |
| **P12 invalida o P10** | Reescreve `<title>` ou description e desfaz unicidade | O gate 9b (`título único por página`) já trava isso |
| **P07 invalida o P04** | CSP estrita mata os 5 blocos inline por página e a conversão morre | Re-teste obrigatório do fluxo após cada degrau. Sem `unsafe-inline` o site perde menu, mosaico, formulários e match |
| **Qualquer regeneração invalida qualquer edição manual em `deploy/`** | Trabalho some sem aviso | Regra de ouro do `ESTADO-REAL` §2, elevada aqui a fronteira absoluta |
| **P14 invalida o P07** | Domínio novo de terceiro não liberado na CSP | O mapa de recursos do P07 é reaberto sempre que P14 adiciona domínio |

---

## 2. Ondas de execução

### 2.1 A regra de conflito

Duas etapas rodam na mesma onda **se e somente se** os conjuntos de escrita são
disjuntos. Os territórios de escrita do repositório são:

| Território | Quem escreve | Risco de colisão |
| --- | --- | --- |
| `docs/**` | quase todas | baixo, se cada etapa tiver seu arquivo dono |
| `scripts/*.mjs` | P02, P04, P09, P10, P11, P12, P14 | **alto**, dois agentes no mesmo `.mjs` |
| `src-site-3/*.html` | P09, P11, P12 | **alto**, 13 arquivos com bloco `:root` idêntico |
| `deploy/**` | **ninguém escreve à mão** | crítico, é output |
| `deploy/_headers` | P03, P06, P07, P14 | médio |
| `.github/workflows/**` | apenas P08 | zero, se respeitado |
| `scripts/validate-output.mjs` | todas, ao travar invariante | **crítico**, arquivo mais disputado do repo |
| `package.json` / lockfile | P05, P07 | médio |

### 2.2 O mutex da regeneração

**Só um agente por vez pode rodar a cadeia de pós-processamento.** Rodar
`gerar-site.mjs` ou qualquer `.mjs` que escreva em `deploy/` é operação
exclusiva. O padrão de onda é portanto:

```
  fase A (paralela)   cada etapa lê deploy/, escreve seu .mjs e seu doc
  fase B (serial)     um único agente roda a cadeia e o gate
  fase C (serial)     commit único da onda, com o gate verde
```

Isso preserva o paralelismo onde ele é barato (análise, escrita de script,
documentação) e serializa onde ele é fatal (mutação do output).

### 2.3 As ondas

#### ONDA 0 · Destravamento e congelamento do baseline
**Serial, 1 agente. Nada mais roda antes disto.**

| Etapa | O que faz |
| --- | --- |
| pré-P00 | Restaurar a capacidade de regenerar: `playwright` ausente do lockfile, `executablePath` fixo em `/opt/pw-browsers/chromium-1194`, `RAIZ` hardcoded em 13 scripts |
| pré-P00 | Reconciliar gate x output: hoje `node scripts/validate-output.mjs` reprova com **14 violações**, todas por scripts escritos e nunca aplicados a `deploy/` |
| pré-P00 | Congelar o baseline medido: performance **58**, SEO **44**, acessibilidade **52** (`docs/mythos/baseline/`) |

**Justificativa.** Não se audita, não se mede e não se paraleliza sobre um
output que diverge dos scripts que o produzem. O gate estar vermelho por
expectativa não cumprida, e não por regressão, é o primeiro fato a resolver. E
o commit `fb6306a` mostra o custo de ignorar isso: a publicação ficou congelada
desde o P06 por um `test -f deploy/support.js` num workflow.

---

#### ONDA 1 · Diagnóstico somente leitura
**4 agentes em paralelo. Write-set: `docs/` disjunto. Zero escrita no produto.**

| Etapa | Arquivo dono | Por que pode paralelizar |
| --- | --- | --- |
| **P00** re-auditoria do site 3.0 | `docs/mythos/P00-SITE-3.md` | read-only por lei soberana |
| **P02** arquitetura de informação | `docs/mythos/P02-MATRIZ-PAGINAS.md` | só decide no papel |
| **P17** ética, primeira passagem | `docs/mythos/P17-REGRAS.md` | só lê e cataloga normas |
| **P16** preparo do painel | `docs/mythos/P16-PAINEL.md` | monta a estrutura de julgamento |

**Justificativa.** Nenhuma das quatro escreve fora de `docs/`, e cada uma tem
seu arquivo. É a única onda com paralelismo total sem risco. P17 entra aqui
como **guarda**, não como veto: as regras de publicidade em saúde precisam
existir antes de qualquer linha de conteúdo ser escrita na Onda 5.

Os baselines de P06, P09 e P10 já foram produzidos e pertencem a esta onda,
como leitura já concluída.

---

#### ONDA 2 · Constituição documental
**3 agentes em paralelo. Write-set: `docs/` + configuração de raiz.**

| Etapa | Arquivo dono | Colisão |
| --- | --- | --- |
| **P01** estratégia | `docs/STRATEGY.md`, `REQUIREMENTS.md`, `SCOPE.md` | nenhuma |
| **P03** infraestrutura | `docs/INFRASTRUCTURE.md`, `DEPLOYMENT.md`, `ROLLBACK.md`, `ENVIRONMENT.md` | nenhuma |
| **P05** fundação e DX | `README.md`, `docs/ARCHITECTURE.md`, `DEVELOPMENT.md`, `AI_HANDOFF.md`, `package.json` | só P05 toca `package.json` nesta onda |

**Justificativa.** As três reescrevem documentos que hoje descrevem o projeto
Astro. Não tocam `deploy/` nem `scripts/`. P05 é quem legitimamente conserta o
`playwright` ausente no lockfile, porque reprodutibilidade é o objeto dele.

---

#### ONDA 3 · Estrutura do output
**3 agentes em paralelo na fase A, 1 na fase B.**

| Etapa | Scripts que possui | Doc dono |
| --- | --- | --- |
| **P02** aplicação | `perfis.mjs`, `redirects.mjs` | `INFORMATION_ARCHITECTURE.md` |
| **P10** SEO técnico | `estruturados.mjs`, `sitemap.mjs`, `artigos.mjs`, `areas.mjs` | `SEO_GUIDE.md`, `TECHNICAL_SEO_AUDIT.md` |
| **P09** acessibilidade | `acessibilidade.mjs` | `ACCESSIBILITY_CHECKLIST.md` |

**Justificativa.** Os três conjuntos de `.mjs` são disjuntos. Todos são
transformações puras, então a fase B roda sem Chromium. É a onda que fecha as
violações estruturais do gate: perfis ausentes, `MedicalClinic` e `WebSite`
ausentes, títulos repetidos em 24 das 31 URLs, `main` e link de pular ausentes
nas 11 páginas.

**Restrição.** `sitemap.mjs` roda **por último** na cadeia, sempre. E quem muda
a contagem atualiza o piso em `validate-output.mjs` no mesmo commit.

---

#### ONDA 4 · Conversão, medição e presença local
**3 agentes em paralelo na fase A. Fase B exige Chromium.**

| Etapa | Scripts que possui | Doc dono |
| --- | --- | --- |
| **P04** conversão crítica | `conversao.mjs` (Chromium) | `CONVERSION_GOVERNANCE.md`, `INTEGRATIONS.md` |
| **P14** aquisição e analytics | `medicao.mjs`, `personaliza.mjs` | `ANALYTICS_PLAN.md`, `UTM_GUIDE.md` |
| **EXTRA-GBP** perfil local | nenhum script, só `estruturados.mjs` em leitura | `docs/mythos/GBP-DIAGNOSTICO.md` |

**Justificativa.** P04 e P14 são o par natural: um define o que é sucesso, o
outro mede. GBP consome o NAP que P10 publicou no schema e não escreve script
nenhum, então entra de carona sem risco.

**Verdade que precisa estar escrita.** Não existe backend e não existe
`/obrigado`. `whatsapp_click` e `form_submit` são **tentativa**, nunca conversão
confirmada. O sucesso real acontece dentro do WhatsApp, fora do alcance do site.
Marcar clique como conversão infla o número que decide orçamento de mídia.

---

#### ONDA 5 · Conteúdo, voz e interface
**2 agentes em paralelo. Colisão real em `src-site-3/`, exige partição.**

| Etapa | Territórios | Partição |
| --- | --- | --- |
| **P12** conteúdo e copy | `corpos-artigos.mjs`, `monta-conteudo.mjs`, `almanaque.mjs`, bloco 6 do gate | escreve **texto** |
| **P11** UX, UI e design system | `retoques.mjs`, `mobile.mjs` (Chromium), `mosaico.mjs`, blocos `<style>` de `src-site-3/` | escreve **estilo e estrutura** |

**Justificativa.** São a única dupla que disputa `src-site-3/`. A partição é
semântica: P12 nunca toca `<style>` nem atributo `style=`, P11 nunca toca texto
visível. Se a partição não puder ser garantida, esta onda vira duas.

**Trava herdada.** `.prettierignore` exclui `deploy/` e `src-site-3/` de
propósito: o Prettier reescreve os placeholders `{{ }}` e destrói o gerador.
`npm run format` nesses diretórios é dano irreversível.

---

#### ONDA 6 · Performance e segurança
**2 agentes. Ordem interna fixa, não paralela de verdade.**

| Etapa | Territórios |
| --- | --- |
| **P06** performance | `limpeza.mjs`, `webp.mjs`, atributos de imagem, `lighthouserc*.json` |
| **P07** segurança | `deploy/_headers`, `deploy/.well-known/security.txt`, `package.json` (overrides) |

**Justificativa.** Ambos tocam `_headers` e ambos mexem no que o Lighthouse
mede. A ordem é obrigatória: P06 mede, P07 endurece um degrau, P06 remede. O
budget vence o selo de segurança sempre que houver conflito.

**Limite honesto.** O GitHub Pages ignora `_headers` por completo, e a CSP que
chega ao visitante vem de uma regra no painel da Cloudflare
(`ESTADO-REAL` §4). Editar `_headers` documenta a intenção, não aplica a
política. Isso é pendência do dono, não conquista da esteira.

---

#### ONDA 7 · Automação da governança
**2 agentes. P08 tem exclusividade sobre `.github/workflows/`.**

| Etapa | Territórios |
| --- | --- |
| **P08** CI/CD e quality gates | `.github/workflows/**`, `validate-output.mjs`, `package.json` scripts |
| **P15** manutenção e SLA | `docs/MAINTENANCE_PLAN.md`, `SLA.md`, `MONITORING_PLAN.md`, `POST_99_BACKLOG.md` |

**Justificativa.** P08 é o único autorizado a tocar workflows, e é aqui que
toda promessa das ondas anteriores vira invariante travado. P15 só escreve
`docs/`, então não colide.

**Alvo concreto.** Hoje há três gates decorativos: `continue-on-error: true`
mais `|| true` no link checker do `ci.yml`, Lighthouse mobile com
`if: always()` e `continue-on-error`, e os `lighthouserc*.json` medindo URLs que
não existem no site 3.0 (`/ecooa-med/`, `/contato/`, `/agendamento/`,
`/match/`, `/profissionais/gustavo-gehrke/`).

---

#### ONDA 8 · Tribunais
**4 agentes em paralelo, todos somente leitura.**

| Etapa | Papel |
| --- | --- |
| **P13** QA final | painel da verdade, confronta declaração com artefato |
| **P16** revisor magno | nota de método x execução, por prompt |
| **P17** ética, segunda passagem | veto regulatório sobre o que foi publicado |
| **P19** banca de valor | precificação com lastro documental |

**Justificativa.** Nenhum escreve no produto. P17 volta aqui com o poder que
não tinha na Onda 1: agora existe conteúdo publicado para vetar.

**Regra de ordem.** P19 lê o parecer de P16 e o veto de P17. Se P17 bloquear,
P19 não precifica: precifica-se ativo publicável, não ativo em veto.

---

## 3. Contrato de artefatos

### 3.1 Documentos que já existem e serão ATUALIZADOS

Nenhum é apagado. Documento que descreve o Astro ganha aviso no topo e vai para
`docs/_legacy/` quando for integralmente substituído.

| Arquivo | Estado hoje | Etapa dona | O que muda |
| --- | --- | --- | --- |
| `docs/ESTADO-REAL.md` | **válido, é o dono da verdade** | todas | §2 (handlers pendentes já resolvidos por pré-renderização), §3 (escopo passou de 11 para 31+ URLs), §5 (pendências) |
| `docs/AI_HANDOFF.md` | descreve o Astro | P05 | vira espelho-mestre real, aponta para `ESTADO-REAL` |
| `docs/ARCHITECTURE.md` | 103 páginas, Astro | P05 | reescrito para o pipeline `src-site-3 → deploy` |
| `docs/DEVELOPMENT.md` | Astro | P05 | comandos reais, `playwright` e `RAIZ` documentados |
| `docs/STRATEGY.md` | DEC-01 errado (agendamento) | P01 | DEC-01 vira captação de leads via WhatsApp |
| `docs/REQUIREMENTS.md` | "stack congelada Astro" | P01 | requisito falso removido |
| `docs/SCOPE.md` | PROM-01 a PROM-11 do Astro | P01, P13 | promessas julgadas: quitada, renegociada ou cancelada |
| `docs/INFRASTRUCTURE.md` | DEC-15 Cloudflare não executada | P03 | descreve os dois caminhos vivos |
| `docs/DEPLOYMENT.md` `ROLLBACK.md` `ENVIRONMENT.md` | Astro | P03 | reescritos |
| `docs/CONVERSION_GOVERNANCE.md` | fala de backend e `/obrigado` | P04 | funil real, sem etapa de confirmação |
| `docs/INTEGRATIONS.md` | Google Apps Script | P04 | contrato de resposta de `wa.me` e `mailto` |
| `docs/DATA_GOVERNANCE.md` | formulários inexistentes | P04 | os 3 formulários reais |
| `docs/EVENTS_TRACKING_PLAN.md` | eventos do Astro | P14 | eventos de `medicao.mjs` |
| `docs/PERFORMANCE_BUDGET.md` | Arboria, AVIF, PSI de 2026-05-31 | P06 | budget do site 3.0, baseline 58 |
| `docs/SECURITY.md` | `BaseLayout.astro`, Meta Pixel | P07 | CSP real e degrau real |
| `docs/ACCESSIBILITY_CHECKLIST.md` | tokens `#1c1917`, `/obrigado` | P09 | tokens reais, baseline 52 |
| `docs/SEO_GUIDE.md` | `aggregateRating` 5.0 | P10 | **crítico**, hoje documenta violação do CFM |
| `docs/INFORMATION_ARCHITECTURE.md` `SITEMAP_PLAN.md` `ROUTE_MAP.md` | 100 URLs, Astro | P02 | Matriz de Páginas do site 3.0 |
| `docs/DESIGN_SYSTEM.md` | Arboria, cantos retos | P11 | tokens neumórficos reais, pilhas de sistema |
| `docs/TONE_OF_VOICE.md` `CONTENT_CRO_BUDGET.md` | componentes Astro | P12 | reescritos |
| `docs/CI_CD.md` `QUALITY_GATES.md` | CodeQL fantasma, 103 páginas | P08 | tabela de gates real |
| `docs/QA_FINAL.md` | painel do Astro, quase tudo verde | P13 | marcado como histórico, novo painel em `docs/mythos/` |
| `docs/PENDENCIAS_FINAIS.md` | PEND-01 manda abrir `/agendamento` | P13 | consolidado em um dossiê único |
| `docs/BRANDBOOK-ECOOA.md` | **válido** | P11 | não muda, é referência de preservação |

### 3.2 Documentos NOVOS

| Arquivo | Etapa dona | Conteúdo |
| --- | --- | --- |
| `docs/MYTHOS-ARQUITETURA.md` | esta sessão | este documento |
| `docs/mythos/EXECUCAO.md` | todas | diário do que foi feito |
| `docs/mythos/PENDENCIAS-DO-DONO.md` | todas | **dossiê único** do que exige o dono |
| `docs/mythos/baseline/performance.md` | P06 | nota 58, medido |
| `docs/mythos/baseline/acessibilidade.md` | P09 | nota 52, medido |
| `docs/mythos/baseline/seo-tecnico.md` | P10 | nota 44, medido |
| `docs/mythos/BASELINE-SCORECARD.md` | Onda 1 | as 20 notas antes |
| `docs/mythos/SCORECARD-FINAL.md` | Onda 8 | as 20 notas depois |
| `docs/mythos/P02-MATRIZ-PAGINAS.md` | P02 | Matriz e Contrato |
| `docs/SECURITY_TOOLING.md` | P07 | matriz de 7 camadas |
| `docs/UI_GUIDE.md` | P11 | 15 seções |
| `docs/CONTENT_GUIDE.md` `COPY_GUIDE.md` `CRO_GUIDE.md` | P12 | guias editoriais |
| `docs/ANALYTICS_PLAN.md` `UTM_GUIDE.md` `BOT_TRAFFIC_GUIDE.md` `ACQUISITION_PLAN.md` | P14 | aquisição |
| `docs/MAINTENANCE_PLAN.md` `SLA.md` `MONITORING_PLAN.md` `CHANGE_GOVERNANCE.md` `POST_99_BACKLOG.md` `MONTHLY_REPORT_TEMPLATE.md` | P15 | operação contínua |
| `docs/OBSERVABILITY.md` `SCORECARD.md` `BACKLOG.md` `CHANGELOG.md` | P13 | fechamento |
| `docs/mythos/P16-PARECER.md` | P16 | notas método x execução |
| `docs/mythos/P17-PARECER-ETICO.md` | P17 | veto ou liberação |
| `docs/mythos/P19-VALOR.md` | P19 | precificação com lastro |
| `docs/mythos/GBP-DIAGNOSTICO.md` | GBP | perfil local |

### 3.3 Regra anti-proliferação

Um tema, um dono. Tema sem dono é achado. Tema com dois donos é achado. Quando
um documento novo cobrir integralmente um antigo, o antigo vai para
`docs/_legacy/` com aviso no topo, **não é apagado**. Já existem 10 arquivos lá,
e o padrão está estabelecido.

---

## 4. Tabela de gates consolidada

Gates deduplicados das 20 skills, classificados por como se verificam **neste
ambiente**, que não alcança `www.somosecooa.com.br` (proxy 403) nem a API do
GitHub.

Legenda: **(a)** já automatizável em `scripts/validate-output.mjs` ·
**(b)** verificável por Playwright/Lighthouse local em `localhost:4353` ·
**(c)** impossível sem o dono.

### 4.1 Gates (a) · travados no `validate-output.mjs`

O gate tem hoje 396 linhas e 11 blocos. Cada linha abaixo é invariante real.

| Gate | Bloco | Origem | Estado |
| --- | --- | --- | --- |
| Contrato de Páginas: 9 rotas estratégicas nominais | 1 | P02 | ativo |
| Piso de URLs no sitemap | 1 | P02, P10 | ativo, **piso a reconciliar** |
| 8 áreas e 14 artigos presentes | 1 | P02 | ativo |
| `/404` e `/politicas` fora do sitemap | 1 | P10 | ativo |
| Runtime removido no P06 não volta (`support.js`, babel) | 2 | P06 | ativo |
| Nenhum CDN externo em `deploy/` | 2 | P07 | ativo |
| 3 formulários enviam para o WhatsApp | 3 | P04 | ativo |
| `ecooa.match` religado | 3 | P04 | ativo |
| 15 filtros religados (7 profissionais, 8 blog) | 3 | P04 | ativo |
| Menu de celular nas 11 páginas | 4 | P11 | ativo |
| Mosaico responsivo e instrução de toque | 4 | P11 | ativo |
| Charset nos primeiros 1024 bytes | 5 | P06 | ativo |
| Toda imagem com `width` e `height` (CLS) | 5 | P06 | ativo |
| Um canonical por página, no domínio canônico | 5 | P10 | ativo |
| 9 regex de promessa absoluta (guardião regulatório) | 6 | P12, P17 | ativo, **varre só a raiz** |
| 31 registros com estado válido | 6 | P01, P17 | ativo |
| Registro exibido limpo (decisão do dono, 2026-07-31) | 6 | P01 | ativo |
| 31 perfis presentes com `Person` e seções próprias | 7 | P02, P10 | **falhando** |
| Índice de `/profissionais/` presente | 7 | P02 | **falhando** |
| `MedicalClinic` e `WebSite` na home | 8 | P10, GBP | **falhando** |
| Zero `aggregateRating` e zero `Review` (CFM) | 8 | P17 | ativo |
| Todo JSON-LD sintaticamente válido | 8 | P10 | ativo |
| Camada de medição nas 11 páginas | 9 | P14 | **falhando** |
| `analytics_storage` negado por padrão (LGPD) | 9 | P14 | **falhando** |
| GTM sem tag estática (não compete com LCP) | 9 | P06, P14 | ativo |
| Título único por página | 9b | P10 | **falhando (24 URLs)** |
| Landmark `main` em todas as páginas | 10 | P09 | **falhando** |
| Link de pular navegação | 10 | P09 | **falhando** |
| Anel de foco com contraste suficiente | 10 | P09 | **falhando** |
| Combobox e região viva no match | 10 | P09 | **falhando** |

**14 violações abertas.** Nenhuma é regressão. Todas são scripts escritos e
nunca aplicados a `deploy/`. É exatamente o trabalho das Ondas 3 e 4.

#### Invariantes (a) a acrescentar

| Gate | Etapa | Por quê |
| --- | --- | --- |
| Guardião varre `deploy/` **recursivo** | P12 | hoje ignora 8 áreas e 14 artigos, o conteúdo YMYL de maior risco |
| Zero em-dash no output e em `docs/` | P12 | regra do projeto, hoje não travada |
| Description única por página | P10 | complementa o gate de título |
| OG completo em toda página indexável | P10 | |
| Nenhuma página-ponte no sitemap | P10 | 23 pontes com meta refresh |
| Zero `outline: none` sem alternativa | P09 | origem rastreada em `mosaico.mjs` |
| Nenhum termo de saúde em parâmetro de evento | P14, P17 | o match recebe `?q=` com queixa |
| Peso de HTML por página abaixo do teto | P06 | home tem 166 KB |

### 4.2 Gates (b) · verificáveis por teste local

Rodam contra `deploy/` servido em `localhost:4353` com a CSP de produção,
usando `node_modules/.bin/lighthouse` (13.4.1), `playwright-core` (1.62.1) e o
Chromium em `/opt/pw-browsers/chromium-1194`.

| Gate | Etapa | Método |
| --- | --- | --- |
| Lighthouse Performance mobile e desktop | P06 | CLI, 4 arquétipos: raiz, área, artigo, perfil |
| LCP, CLS, TBT, FCP reais | P06 | `PerformanceObserver` via Playwright |
| Lighthouse Accessibility | P09 | CLI |
| axe-core nas 31 URLs, desktop e mobile | P09 | injeção via Playwright |
| Ordem de foco, foco visível, armadilha de teclado | P09 | `Accessibility.getFullAXTree` via CDP |
| Zoom 200% e reflow sem scroll horizontal | P09 | viewport estreita |
| Contraste real do anel de foco | P09 | amostragem de pixel com `sharp` |
| Lighthouse SEO e Best Practices | P10, P07 | CLI |
| Links internos quebrados | P10 | grafo BFS sobre os 63 HTML |
| Formulário monta a URL correta de `wa.me` | P04 | Playwright, clique e leitura do `href` |
| Menu, mosaico, modal e match funcionam | P04, P11 | Playwright |
| Inventário visual antes x depois | P11 | screenshot mobile 412x823 e desktop 1440x1000 |
| Headers servidos localmente | P07 | `curl -I` contra o servidor local, rotulado **laboratório** |
| Idempotência dos pós-processadores | P08 | rodar duas vezes, comparar hash |

### 4.3 Gates (c) · impossíveis sem o dono

| Gate | Etapa | Por quê |
| --- | --- | --- |
| Lead chega ao destino | P04, P13 | só o dono abre o WhatsApp Business e a caixa de e-mail |
| Lighthouse de **campo** (PSI, CrUX) | P06, P13 | exige o domínio no ar e conta Google |
| CSP que o visitante recebe | P07 | vem de regra no painel Cloudflare, não de `_headers` |
| `curl -I` contra o domínio | P07, P13 | proxy 403 |
| CI verde no PR, PR em draft | P08 | API do GitHub inacessível |
| Branch protection e required checks | P08 | painel do GitHub |
| Origem de publicação em Settings > Pages | P03, P08 | painel do GitHub |
| Tags dentro do GTM e propriedade GA4 | P14 | painel do Google |
| Search Console: propriedade e sitemap | P10, P14 | painel do Google |
| Google Business Profile reivindicado | GBP | painel do Google |
| Teste com leitor de tela (NVDA, VoiceOver, TalkBack) | P09 | só humano testa |
| Validação dos 10 registros profissionais | P17 | conselhos |
| Revisão jurídica de `/politicas` | P17 | advogado |
| Revisão dos 14 artigos por quem assina | P12, P17 | os profissionais |
| Cessão de imagem e fotos do espaço | P11, GBP | material físico |
| Redirects 301 reais no lugar das 23 pontes | P10 | painel Cloudflare |
| E-mail em domínio próprio | P04, P07 | provedor |
| Cutover para Cloudflare Workers | P03, P07 | decisão e painel |

---

## 5. Sistema de notas 0-100

### 5.1 Princípio

Nota é medição, não opinião. Três regras herdadas das skills, elevadas a lei
desta arquitetura:

1. **Sem artefato, sem nota.** Toda nota cita `arquivo:linha`, saída de comando
   ou medição datada. "Foi validado na etapa X" não é prova.
2. **Rótulo obrigatório.** Todo número declara **CAMPO** ou **LABORATÓRIO**.
   Neste ambiente, tudo é laboratório. Nenhuma meta fecha em definitivo.
3. **"Não medido" vale mais que estimativa.** Dimensão sem medição recebe
   `n/m`, não recebe nota chutada.

### 5.2 As 20 dimensões por etapa

Cada etapa recebe **duas notas separadas**, nunca somadas:

- **MÉTODO 0-100**: a skill foi seguida? gates respeitados, fronteiras
  honradas, templates usados?
- **EXECUÇÃO 0-100**: o resultado no produto melhorou? medido, não afirmado.

A nota que vale como estado do site é a de **EXECUÇÃO**. A de MÉTODO explica.

| Etapa | Dimensão | Métrica primária | Antes |
| --- | --- | --- | --- |
| P00 | Auditoria | cobertura de inventário e evidência | n/m |
| P01 | Estratégia | fatos com fonte / fatos usados | n/m |
| P02 | Arquitetura | páginas na Matriz / páginas no output | n/m |
| P03 | Infraestrutura | capacidades verificadas e datadas | n/m |
| P04 | Conversão | fluxos com contrato escrito e testado | n/m |
| P05 | Fundação | Clone Limpo verde, binário | **0** (playwright ausente) |
| P06 | Performance | Lighthouse mobile + LCP/CLS/TBT | **58** |
| P07 | Segurança | degrau de CSP real + vulnerabilidades runtime | n/m |
| P08 | CI/CD | gates bloqueantes / gates necessários | n/m |
| P09 | Acessibilidade | Lighthouse a11y + axe + manual | **52** |
| P10 | SEO técnico | Lighthouse SEO + schema + títulos únicos | **44** |
| P11 | UX e UI | inventário visual + consistência de token | n/m |
| P12 | Conteúdo | palavras próprias por artigo + guardião verde | n/m |
| P13 | QA final | critérios com artefato / critérios declarados | n/m |
| P14 | Aquisição | eventos implementados com as 6 disciplinas | n/m |
| P15 | Manutenção | rotinas com dono nomeado | n/m |
| P16 | Revisão magna | notas com artefato / notas emitidas | n/m |
| P17 | Ética | achados com norma citável e vigência | n/m |
| P19 | Valor | números com procedência rotulada | n/m |
| GBP | Local | itens do perfil completos | n/m |

### 5.3 Dimensões transversais

Cortam todas as etapas e entram no score global com peso próprio.

| Dimensão | Como se mede | Peso |
| --- | --- | --- |
| **Integridade do gate** | violações abertas em `validate-output.mjs`. Zero é 100 | 2x |
| **Densidade de evidência** | % de afirmações com prova citável | 2x |
| **Veracidade documental** | espelhos que batem com o produto / espelhos existentes | 1x |
| **Preservação** | alterações não autorizadas em identidade, fotos, paleta, copy. Qualquer uma zera | veto |
| **Conformidade regulatória** | achados críticos abertos em P17. Qualquer um zera | veto |
| **Integridade de conversão** | os 3 formulários e os CTAs de `wa.me` funcionam | veto |
| **Reprodutibilidade** | pipeline roda do zero e produz output idêntico | 2x |
| **Rotulagem** | % de números com rótulo campo/laboratório. Meta 100% | 1x |

### 5.4 Cálculo

```
NOTA_ETAPA        = execução (0-100), com método ao lado, nunca somados
SCORE_PRODUTO     = média ponderada das dimensões de etapa medidas
                    + transversais com peso
                    x  0  se qualquer veto disparar
SCORE_MÉTODO      = média das notas de método das etapas executadas
SCORE_PRONTIDÃO   = SCORE_PRODUTO limitado pelo teto dos gates (c) pendentes
```

Etapa não executada entra como **"não executado"**, nunca como nota. Preencher
20 linhas quando só 6 rodaram é dado inventado cometido pelo próprio tribunal.

### 5.5 Registro antes e depois

- **Antes**: `docs/mythos/baseline/*.md` mais `docs/mythos/BASELINE-SCORECARD.md`,
  congelados na Onda 1, nunca reescritos.
- **Depois**: `docs/mythos/SCORECARD-FINAL.md`, na Onda 8, com a mesma
  ferramenta, o mesmo ambiente e o mesmo rótulo.
- **Comparação inválida**: medir "antes" em `deploy/` velho e "depois" em
  `deploy/` regenerado por outra onda. Todo par antes/depois registra o hash do
  commit.

---

## 6. Fronteiras absolutas

Valem para as 20 etapas, para qualquer agente, em qualquer onda. Não há
autorização que as dispense, porque o dono está ausente.

### 6.1 Identidade visual

Intocáveis sem autorização explícita: fotos aprovadas, logo, símbolos, **paleta
macro** do `BRANDBOOK-ECOOA.md`, texturas, linguagem neumórfica
(`--relevo`, `--afundado`), as pilhas de fonte do sistema, o mosaico dos 31
perfis, a grafia **ecooa** em minúsculas, os labels de navegação em lowercase.

O site não usa **nenhuma fonte web**. "Melhorar a tipografia" não pode
significar adicionar fonte: viola a regra de fontes self-hosted e o budget.

Correção de contraste é sempre por **token contextual**. A paleta macro fica
intacta.

### 6.2 Dados de profissional

- **Nunca inventar registro profissional.** Os estados válidos em
  `deploy/dados-ecooa.js` são `confirmado`, `a-confirmar`, `a-adicionar`.
  Hoje: 21, 5 e 5.
- Nunca inventar formação, título, especialidade ou RQE. Sem RQE não existe
  "especialista em", existe "atuação em".
- Nunca inventar avaliação, depoimento, `aggregateRating` ou `reviewCount`. O
  gate bloco 8 já trava, e é vedação do CFM.
- Nunca aplicar régua CFM ou COFEN a nutricionista, biomédica, psicólogo,
  fisioterapeuta, farmacêutica, dentista ou terapeuta. **26 dos 31 estão fora
  da jurisdição CFM/COFEN.**

### 6.3 Promessa em saúde

Proibidos em qualquer superfície: vagas limitadas, garantir, garantido, 100%
eficaz, melhor clínica, sem risco, resultado garantido, permanente e definitivo
como promessa absoluta, cura, milagroso, antes e depois.

Negação de posicionamento não é infração. O site diz, no FAQ de
`dados-ecooa.js`, que **não** publica antes e depois, por decisão ética. Isso é
absolvição com artefato, não achado.

Nenhum agente cria parecer jurídico nem declara conformidade. Aponta risco e
nomeia a validação humana.

### 6.4 Conversão

- Nunca quebrar os 3 formulários, o botão flutuante ou os CTAs de
  `wa.me/5551991460909`.
- Nunca tratar clique como conversão confirmada. **Não há backend, não há
  `/obrigado`.** O sucesso real acontece dentro do WhatsApp.
- Nunca enviar dado de saúde para analytics. O termo digitado no ecooa.match é
  informação sensível e não viaja no evento.
- Quem toca o fluxo, re-testa o fluxo. Sem exceção.
- Nunca remover `unsafe-inline` de `script-src` sem plano de hash: os 5 blocos
  inline por página religam menu, mosaico, mobile, formulários e match.

### 6.5 Integridade do repositório

- **Nunca editar `deploy/*.html` à mão.** É output. Toda correção nasce em
  `src-site-3/`, em `deploy/dados-ecooa.js` ou num pós-processador.
- Nunca apagar `deploy/`. O build não o recria. É a publicação.
- Nunca rodar `npm run format` sobre `deploy/` ou `src-site-3/`. O
  `.prettierignore` os exclui de propósito: o Prettier destrói os placeholders
  `{{ }}`.
- Nunca baixar threshold de gate para passar. Gate vermelho por motivo certo é
  informação, não obstáculo.
- Nunca inserir credencial em painel em nome do dono.
- Nunca fazer deploy de produção sem autorização.
- Nunca reescrever histórico git.
- Sem em-dash. Acentos pt-BR obrigatórios. Sem biblioteca JS externa.

---

## 7. Adaptações necessárias

Onde as skills presumem uma realidade que não é a do ecooa, e como traduzir sem
trair o método. A regra: **preservar a intenção do gate, trocar o mecanismo**.

| A skill presume | A realidade é | Adaptação |
| --- | --- | --- |
| `npm run build` gera páginas | copia `deploy/` para `dist/` | O build de conteúdo é `node scripts/gerar-site.mjs`. A contagem vem de `find deploy -name '*.html'` e do `<loc>` do sitemap, não da saída do build |
| Contar páginas do build prova o Contrato | `deploy/` é commitado à mão | O Contrato vive no bloco 1 de `validate-output.mjs`, com rotas **nominais**. Contagem sozinha não prova nada |
| Editar `src/` e `public/` | são o Astro **não publicado** | Todos os greps das skills apontam para `src content public`. Devem apontar para `deploy/`, `src-site-3/` e `scripts/`. Rodar literal audita o site errado e devolve falso verde |
| Backend com status e corpo | zero backend | O Contrato de Resposta é escrito para os dois transportes reais: navegação em âncora para `wa.me` e `window.location.href` para `mailto`. Declarar que o sucesso **não é observável** é o achado, não a falha |
| Página de obrigado com `noindex` | não existe | Registrar ausência por design, com DEC. Não criar rota para satisfazer checklist |
| CSS em arquivos, tokens em `tokens.css` | CSS inline, `:root` duplicado em 13 arquivos de `src-site-3/` | A Lei do Token Único se cumpre no **gerador**: extrair o bloco para um parcial injetado, com o inline saindo idêntico byte a byte. Arquivo CSS externo adicionaria requisição bloqueante e mexeria no LCP |
| Subset de fonte é correção padrão | nenhuma fonte web | Marcar não aplicável por construção. Adicionar fonte para poder subsetar viola a regra do projeto |
| Analytics instalado (GTM) | estava em **zero** páginas | O achado é "site sem medição nenhuma", não "analytics a otimizar". GTM existia em dez documentos e em nenhuma página |
| CSP no repositório | vem do painel Cloudflare | `_headers` documenta intenção. Aplicação é do dono. "Header aplicado" e "header verificado" são coisas diferentes |
| Service worker de cache | `deploy/sw.js` é de **autodestruição** | Existe para matar o SW antigo que impunha a CSP velha. Auditá-lo como PWA gera achados fantasma |
| Página órfã se remove ou se linka | 23 páginas-ponte com meta refresh | São URLs antigas já indexadas. Removê-las cria 404. O 301 real depende do painel. Documentar com prazo de morte, não apagar |
| `astro check` valida o projeto | valida o Astro **não publicado** | Verde ali é ruído. Os 29 `.mjs` de `scripts/`, que são o build real, não têm typecheck. Registrar a lacuna |
| Suíte com `test`, `lhci`, `test:a11y` | não existem no `package.json` | Registrar como ausentes, usar `npm run validate` e o Lighthouse CLI direto. Não inventar que rodaram |
| CI verde no próprio PR como prova | API do GitHub inacessível | Declarar limitação de ambiente e emitir pendência com prazo. Nunca simular |
| Documentação anterior como insumo | 41 documentos descrevem o Astro | `docs/ESTADO-REAL.md` cruzado com o filesystem é a única base. Ler `AI_HANDOFF.md` ou `QA_FINAL.md` como estado atual audita outro produto |
| Um dossiê de pendências | existem dois concorrentes | Consolidar em `docs/mythos/PENDENCIAS-DO-DONO.md`. Duas verdades é nenhuma cobrança |

---

## 8. Riscos de execução autônoma

O dono está ausente. Não há quem interrompa. Cada risco abaixo tem mecanismo de
proteção que **não depende de alguém olhando**.

### 8.1 Riscos e proteções

| # | Risco | Como aparece | Proteção mecânica |
| --- | --- | --- | --- |
| 1 | **Regeneração destrói trabalho de outra onda** | Dois agentes rodam pós-processadores ao mesmo tempo, `deploy/` fica num estado que nenhum dos dois produziu | Mutex de regeneração: fase B serial, um agente por vez. Commit único por onda com o gate verde |
| 2 | **Edição manual em `deploy/` some** | Correção passa no gate, some na próxima geração | Fronteira 6.5. Invariante de idempotência: rodar a cadeia duas vezes e comparar hash |
| 3 | **Gate afrouxado para passar** | Encontra 14 violações, baixa o piso do sitemap | Gate é read-only para todos menos P08, e P08 só o **endurece**. Qualquer redução exige registro no commit |
| 4 | **Falso verde do laboratório** | Lighthouse local vira "performance resolvida" | Rotulagem obrigatória. Nenhuma meta fecha sem campo, e campo é (c) |
| 5 | **Espelho que mente** | `docs/mythos/EXECUCAO.md` afirma 62 URLs e 31 perfis; `deploy/` tem 31 URLs e nenhum perfil | Rito anti-decaimento: antes de qualquer fechamento, confrontar cada afirmação com o filesystem. Prova é `find`, não parágrafo |
| 6 | **Dado inventado em saúde** | Preencher registro faltante, criar depoimento | Gate bloco 6 e bloco 8. Veto de P17. Fronteira 6.2 |
| 7 | **Promessa de resultado** | Copy de conversão escorrega | Guardião regulatório no `validate` central, a ser tornado recursivo |
| 8 | **Conversão quebra em silêncio** | CSP endurecida, formulário morre | Bloco 3 do gate. Re-teste Playwright após cada onda que toque `conversao.mjs` ou `_headers` |
| 9 | **Redesign disfarçado** | Muitos refinamentos somam e descaracterizam | Inventário visual antes x depois. Diferença não declarada é regressão a investigar |
| 10 | **Deploy quebrado sem ninguém ver** | Foi o que aconteceu: `test -f deploy/support.js` congelou a publicação do P06 até `fb6306a` | `deploy.yml` roda o gate antes de publicar. Ainda assim, confirmar a origem em Settings > Pages é (c) |
| 11 | **Auto-merge sem revisão** | `auto-merge.yml` dispara em push para `claude/**`, abre PR com `--draft=false` e habilita squash | Reconhecido como conflito com a exigência de PR draft. Registrado, não contornado em silêncio |
| 12 | **Deriva de escopo** | "Já que estou aqui, arrumo isto" | Territórios de escrita da §2.1. Arquivo fora do write-set da onda é violação |
| 13 | **Fechamento de fachada** | Declarar 20 etapas concluídas com 6 executadas | Etapa não executada entra como "não executado". Nunca nota |
| 14 | **Pendência sem dono** | Dossiê apodrece | Toda pendência com o que é, por que importa, risco, passo a passo, prazo e como verificar |
| 15 | **Ambiente confundido com defeito** | `npm ci` falha por proxy e alguém "conserta" o projeto | Falha de rede se registra como limitação de ambiente, nunca como achado do produto |

### 8.2 O protocolo de segurança da onda

Toda onda executa esta sequência, sem atalho:

```
1. ler        estado real do filesystem, nunca da documentação
2. medir      baseline das páginas que a onda vai tocar, com rótulo
3. escrever   só dentro do write-set declarado da onda
4. aplicar    fase B serial, um agente, cadeia completa de pós-processadores
5. validar    node scripts/build-site.mjs && node scripts/validate-output.mjs
6. remedir    as mesmas páginas, mesma ferramenta, mesmo ambiente
7. travar     invariante novo no gate, para a conquista não regredir
8. commitar   um commit por onda, mensagem em português, gate verde
9. registrar  o que foi feito, o que não foi, e o que ficou para o dono
```

**Se o passo 5 falhar, o passo 8 não acontece.** Rollback é `git revert` do
commit da onda. Como cada onda é um commit único com o gate verde, o rollback é
sempre limpo e sempre para um estado publicável.

### 8.3 O que a autonomia não pode comprar

Três coisas continuam impossíveis por mais competente que seja a execução:

1. **Saber se o site está no ar.** Proxy 403 no domínio, API do GitHub
   inacessível. Todo dado é laboratório.
2. **Saber se o lead chega.** Não há backend. Só quem abre o WhatsApp Business
   sabe.
3. **Assinar o que é regulado.** Registro profissional, revisão jurídica e a
   assinatura dos 14 artigos por quem os assina são atos humanos.

Fingir qualquer uma das três seria a única falha desta esteira capaz de causar
dano real ao dono. Todas as outras se corrigem com um `git revert`.
