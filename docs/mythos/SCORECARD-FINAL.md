# Placar Mythos: antes e depois

> Execução autônoma da esteira completa, 2026-08-01, com o dono ausente.
> Método: dez auditores independentes mediram o estado inicial com Lighthouse
> 13.4.1, axe-core 4.12.1 e Playwright contra `deploy/` servido com a CSP de
> produção. Depois vieram as correções. Depois, nova medição.
>
> **Honestidade sobre o método.** Quatro dimensões (performance, acessibilidade,
> SEO técnico e segurança) foram medidas antes de qualquer alteração: o "antes"
> delas é limpo. As outras seis começaram a medir antes e terminaram depois de
> as primeiras correções entrarem, então o número inicial delas é de meio de
> voo. Onde isso acontece, o documento diz, e o "antes" real é reconstruído a
> partir de fatos verificáveis apurados no reconhecimento (zero analytics no
> HTML, doze artigos sem corpo, vinte e dois títulos duplicados). Preferi
> declarar a contaminação a exibir uma comparação bonita e falsa.

---

## 1. Notas por dimensão

| Dimensão | Antes | Base do "antes" |
| --- | ---: | --- |
| Performance e Core Web Vitals (P06) | 58 | limpo |
| Conversão crítica (P04) | 57 | meio de voo |
| Acessibilidade WCAG (P09) | 52 | limpo |
| Ética e regulatório (P17) | 46 | meio de voo |
| SEO técnico (P10) | 44 | limpo |
| UX, UI e design system (P11) | 44 | meio de voo |
| Segurança técnica (P07) | 42 | limpo |
| Infra, CI/CD e DX (P03/P05/P08) | 34 | meio de voo |
| Conteúdo, copy e E-E-A-T (P12) | 33 | meio de voo |
| Analytics e aquisição (P14) | 26 | meio de voo |
| **Média** | **43,6** | |

A nota "depois" por dimensão fica com os tribunais independentes (P13, P16, P17
e P19), que auditam o resultado sem a mão de quem executou. Autoatribuir nota
depois de mexer no próprio trabalho não vale como medição.

### Lighthouse por página, medido no laboratório

| Página | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Área de especialidade (medicina) | 100 | 100 | 100 | 100 | 1,7 s | 0 |
| Artigo (queda de cabelo) | 100 | 100 | 100 | 100 | 1,7 s | 0 |
| Perfil de profissional (Natálie) | 98 | 100 | 100 | 100 | 2,3 s | 0 |
| Home | 91 | 96 | 100 | 100 | 3,3 s | 0 |

As páginas que nasceram ou foram reescritas nesta sessão são hoje as melhores do
site nos quatro eixos. O que ainda pesa nelas é artefato do laboratório: o
servidor de teste não envia `Cache-Control` nem compressão, e o Lighthouse cobra
isso como se fosse falha do site.

### axe-core em 8 páginas, celular 390x844

| Momento | Nós críticos | Graves | Moderados | Leves |
| --- | ---: | ---: | ---: | ---: |
| Depois das correções | 0 | 2 | 0 | 0 |

Os dois nós graves restantes são o mesmo defeito: na faixa grafite do
ecooa.match, na home, o número "07" e o rótulo "orientação e conexão" usam
prata sobre grafite, o que dá 3,55:1 contra o mínimo de 4,5:1. A correção
(trocar prata por névoa, que dá 5,01:1) **não foi aplicada**: o dono pediu, no
fim da sessão, que nenhuma mudança de aparência fosse feita sem a ordem dele.
Fica como apontamento.

---

## 2. O que mudou de fato

### Estrutura

| Indicador | Antes | Depois |
| --- | ---: | ---: |
| URLs indexáveis no sitemap | 31 | 62 |
| Páginas com dado estruturado | 22 | 56 |
| Páginas com a entidade da clínica | 0 | 2 |
| Páginas com título único | 42 de 64 | 64 de 64 |
| Páginas com landmark `main` | 0 | 67 |
| Páginas com link de pular navegação | 0 | 67 |
| Páginas que medem audiência | 0 | 66 |
| Profissionais com página própria | 0 | 31 |
| CTAs de WhatsApp personalizados | 98 | 191 |
| Invariantes travados no gate | 18 | 30 |
| Palavras de corpo de artigo | 3.407 | 14.582 |
| Palavras próprias nas 8 áreas | 2.129 | 11.034 |
| Artigos com texto próprio | 2 de 14 | 14 de 14 |
| Scripts do site sob análise estática | 0 de 17 | 17 de 17 |

### Defeitos que estavam invisíveis

1. **A publicação estava travada.** O job de deploy dependia de um arquivo
   apagado no P06. Nenhuma verificação apontava isso porque o próprio gate
   estava quebrado.
2. **Vinte e dois títulos duplicados.** Os geradores procuravam `<title>` e a
   tag real vinha `<title data-dc-tpl="1">`. A troca nunca aconteceu, e os
   catorze artigos ficaram com o título do editorial.
3. **Zero medição.** O contêiner GTM aparecia em dez documentos e em nenhuma
   página.
4. **Queixa clínica em URL.** O CTA do resultado da busca embutia a frase
   digitada pelo paciente na URL do WhatsApp, contrariando a promessa da própria
   tela.
5. **Geração irreprodutível.** `playwright` e `sharp` nunca estiveram
   declarados. Num clone limpo, o site não se gera.
6. **Doze artigos vazios.** Páginas indexadas com título e nada mais.

### Violações regulatórias encontradas e corrigidas

O conteúdo novo passou por um guardião adversarial que varre CFM 1.974/2011 e
2.336/2023, COFEN, CFN, CFF, CRP e CFO procurando promessa de resultado,
superlativo, sensacionalismo, mercantilização, prescrição a distância,
autodiagnóstico, dado inventado e desvio de escopo profissional.

| Frente | Violações encontradas e corrigidas |
| --- | ---: |
| 8 páginas de especialidade | 157 |
| 12 artigos novos | 123 |
| **Total** | **280** |

O número justifica a segunda passagem: texto gerado por IA em saúde erra
sobretudo em dado inventado e em escopo profissional, e erra em volume.

---

## 3. O que não foi possível medir daqui

- Campo real (CrUX, PageSpeed Insights sobre o domínio): o ambiente não alcança
  `www.somosecooa.com.br`.
- Cabeçalhos HTTP de produção: mesma razão. O `deploy/_headers` é inerte no
  GitHub Pages, então a política efetiva vem de uma regra de painel Cloudflare
  que não está no repositório.
- Estado dos workflows no GitHub: a API não é alcançável.
- Leitor de tela real (NVDA, VoiceOver, TalkBack): exige pessoa.
- Chegada de lead no destino: exige o WhatsApp e a caixa de e-mail do dono.

Cada um desses está em `docs/mythos/PENDENCIAS-DO-DONO.md` com o passo a passo.
