# Estado real do ecooa-website

> Documento dono da verdade sobre o que está publicado. Criado em 2026-07-30 na
> auditoria Mythos (P00) e nas execuções de P01, P03, P04, P05 e P06.
>
> **Em conflito com qualquer outro documento de `docs/`, vale este.** Os 41
> documentos anteriores descrevem o projeto Astro, que **não está publicado**.
> Nenhum deles menciona a pasta `deploy/` nem o site 3.0. Ler `AI_HANDOFF.md`
> sem ler este aqui leva a conclusões erradas sobre fonte de dados, conversão,
> número de páginas e fontes tipográficas.

---

## 1. Dois projetos coexistem. Só um está no ar.

| | site 3.0 (**publicado**) | projeto Astro (**não publicado**) |
|---|---|---|
| Onde | `deploy/` | `src/` |
| Como nasce | `src-site-3/` pré-renderizado por `scripts/gerar-site.mjs` | `astro build` |
| Build | `npm run build` → copia `deploy/` para `dist/` | `npm run build:astro` → `dist-astro/` |
| Páginas | 11 | 104 |
| Fonte de dados | `deploy/dados-ecooa.js` (`window.ECOOA`) | `src/data/*.ts` |
| Conversão | WhatsApp + 3 formulários que abrem WhatsApp ou e-mail | Google Apps Script + `/obrigado` |
| Tipografia | apenas pilhas do sistema, nenhuma fonte web | Arboria e Playfair |
| Serve o domínio | sim | não |

O projeto Astro é mantido no repositório porque contém conteúdo e componentes
que ainda podem ser reaproveitados. Ele **não deve** ser publicado sem decisão
explícita do dono.

## 2. Como o site publicado é gerado

```
src-site-3/*.html          templates originais do autor, com placeholders {{ }}
        │                  e blocos <x-dc> que o runtime compilaria no navegador
        ▼
scripts/gerar-site.mjs     abre cada página num Chromium headless, deixa o
        │                  runtime resolver, e grava o DOM já pronto
        ▼
deploy/*.html              HTML estático, sem eval, sem React
        │
        ├── scripts/nav-links.mjs    liga os links do topo
        ├── scripts/menus.mjs        religa os submenus do cabeçalho
        ├── scripts/mosaico.mjs      religa hover e modal dos 31 perfis
        ├── scripts/mobile.mjs       restaura a responsividade do autor
        ├── scripts/conversao.mjs    religa formulários e filtros
        └── scripts/limpeza.mjs      remove runtime morto, arruma charset e imagens
        ▼
npm run build              copia deploy/ para dist/
```

**Regra:** qualquer mudança em `src-site-3/` ou em `deploy/dados-ecooa.js` exige
rodar `node scripts/gerar-site.mjs` de novo. Editar `deploy/*.html` à mão perde
na próxima geração.

### Por que pré-renderizar

Os templates dependiam de `support.js`, que carregava React, ReactDOM e Babel
Standalone e compilava JSX no navegador com `new Function`, ou seja `eval`. A
política de segurança do domínio proíbe `eval`, então as páginas apareciam com
barras de erro. Pré-renderizar resolve na origem: o HTML sai pronto e o runtime
deixa de existir.

### O preço da pré-renderização, e como é pago

Congelar o DOM num único momento descarta todo comportamento que vivia em
JavaScript. O template declarava **32 handlers**. A pré-renderização preservou
**zero**. Cada script da lista acima existe para devolver um pedaço disso, em
JavaScript comum. Estado em 2026-07-30:

| handler | onde | situação |
|---|---|---|
| `abrirEsp`, `abrirProf`, `abrirMais` | cabeçalho | religado (`menus.mjs`) |
| `abrirMobile` | cabeçalho | religado (`mobile.mjs`) |
| `m.abrir`, `fecharPerfil` ×2 | home, mosaico | religado (`mosaico.mjs`) |
| `inscrever` | rodapé, 11 páginas | religado (`conversao.mjs`) |
| `enviar` | mentorias | religado (`conversao.mjs`) |
| `enviar` | sublocação | religado (`conversao.mjs`) |
| `f.aplicar` | profissionais | religado (`conversao.mjs`) |
| `f.aplicar` | blog | religado (`conversao.mjs`) |
| `c.abrir`, `fecharPerfil` ×2 | profissionais | religado (`mosaico.mjs`) |
| `e.abrir`, `voltar` ×2 | especialidades | **pendente** |
| `a.abrir`, `r.abrir`, `voltar` | blog | **pendente** |
| 10 handlers da busca por IA | qual-profissional-procurar | **pendente** |

Os pendentes têm em comum uma coisa: reconstroem uma **visão de detalhe** que
substitui a lista. Todos leem `location.hash`. Isso abre um caminho melhor que
religar em JavaScript: pré-renderizar cada estado como página real
(`/especialidades/medicina/`, `/blog/<slug>/`), o que resolve o handler morto e
o SEO no mesmo movimento. É trabalho de P02 e P10, já aprovado pelo dono.

## 3. Estratégia (P01)

**Negócio.** Clínica multiprofissional em Moinhos de Vento, Porto Alegre. 31
profissionais autônomos de 9 classes, sob o mesmo critério de indicação. Marcas
internas: `ecooa.med`, `ecooa.esthetic`, `ecooa.mind`, `ecooa.working`,
`ecooa.cademy`.

**Persona primária.** Mulher, 30 a 70 anos, que chega pelo Instagram, pelo
Google Maps ou por indicação no WhatsApp. **Descobre pelo celular.** Isso torna
a experiência mobile a principal, não a reduzida.

**O que é um lead.** Uma conversa iniciada no WhatsApp `+55 51 99146-0909`.

**Canais de conversão, em ordem:**

1. WhatsApp direto (botão flutuante em todas as páginas, CTA do cabeçalho, CTA
   de cada perfil no modal). É o canal principal.
2. Formulário de mentoria (`/mentorias`) → abre WhatsApp preenchido.
3. Formulário de sublocação (`/sublocacao`) → abre WhatsApp preenchido.
4. Newsletter do rodapé → abre um e-mail preenchido para `ecooa.adm@gmail.com`.

Não existe backend de formulário. Nada é gravado em servidor. **Consequência
que o dono precisa saber:** um lead só existe se a pessoa completar o envio no
WhatsApp ou no cliente de e-mail. Não há como medir quem desistiu no meio, nem
recuperar quem fechou a aba. Medir isso é trabalho de P14.

**Requisitos não negociáveis (nicho regulado, saúde):**

- Nunca inventar número de registro profissional. Os estados válidos em
  `dados-ecooa.js` são `confirmado`, `a-confirmar` e `a-adicionar`, e a ressalva
  aparece no modal sempre que não for `confirmado`. Hoje: 21 confirmados,
  5 a confirmar, 5 a adicionar.
- Nenhuma promessa de resultado, garantia, superioridade ou urgência
  fabricada. `scripts/validate-output.mjs` bloqueia no build.
- Conselhos envolvidos: CFM/CRM, COFEN/COREN, CFN/CRN, CREFITO, CRP, CRBM.

**Escopo fechado do site publicado:** 11 páginas.
`/` · `/sobre` · `/especialidades` · `/profissionais` ·
`/qual-profissional-procurar` · `/blog` · `/localizacao` · `/mentorias` ·
`/sublocacao` · `/politicas` (noindex) · `/404` (noindex).

**Fora de escopo até decisão do dono:** textos reais dos 14 artigos do
editorial, páginas de detalhe por especialidade e por profissional, área
logada, busca semântica, e-commerce.

## 4. Infraestrutura (P03)

- **Domínio canônico:** `https://www.somosecooa.com.br` (`deploy/CNAME`).
- **Hospedagem:** GitHub Pages hoje, com a Cloudflare como proxy na frente.
  `wrangler.jsonc` já aponta para `./deploy` para a migração a Workers.
- **Três caminhos servem o mesmo site:** o workflow do Pages publica `deploy/`,
  o wrangler serve `./deploy`, e `npm run build` copia `deploy/` para `dist/`.
- **Cabeçalhos:** `deploy/_headers`. A Cloudflare aplica; o GitHub Pages ignora
  sem efeito colateral.
- **Território do dono, não do repositório:** a CSP que hoje chega ao visitante
  é injetada por uma regra no painel da Cloudflare e **não** vem de `_headers`.
  Enquanto essa regra existir, mudanças em `_headers` não têm efeito.

## 5. Pendências que dependem do dono

| # | O que | Onde | Por quê |
|---|---|---|---|
| 1 | Liberar `https://www.google.com` em `frame-src` | painel Cloudflare | o mapa de `/localizacao` está bloqueado |
| 2 | Assumir ou remover a regra de CSP do painel | painel Cloudflare | hoje ela sobrepõe `_headers` e ninguém no repositório controla |
| 3 | Validar 10 registros profissionais | conselhos | 5 a confirmar e 5 a adicionar aparecem com ressalva |
| 4 | Textos reais dos 14 artigos | conteúdo | pré-requisito para `/blog/<slug>/` |
| 5 | Revisão jurídica de `/politicas` | jurídico | página existe, texto não foi revisado |
| 6 | E-mail em domínio próprio | provedor | hoje o rodapé usa `ecooa.adm@gmail.com` |
| 7 | Redirects 301 de verdade | painel Cloudflare | hoje são páginas-ponte em HTML |

## 6. Documentação anterior: o que ainda vale

Os 41 documentos de `docs/` foram escritos entre P00 e P13 para o projeto
Astro. Continuam úteis como **registro de decisão e de método**, e enganosos
como **descrição do que está no ar**. Em particular, desconsidere destes
documentos, para o site publicado:

- contagem de páginas (falam de 103 ou 104; o publicado tem 11)
- fonte única de contato em `src/data/constants.ts`
- `src/scripts/form-submit.ts` como coração da conversão
- fontes Arboria e Playfair (o site publicado não usa fonte web alguma)
- rotas `/quem-somos/`, `/contato/`, `/agendamento/`, `/match/`

O que **permanece válido** em qualquer cenário: `BRANDBOOK-ECOOA.md` (paleta e
direção visual), as regras de preservação absoluta, e as travas regulatórias.
