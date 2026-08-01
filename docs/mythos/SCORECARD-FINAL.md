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

| Dimensão | Antes | Depois | Base do "antes" |
| --- | ---: | ---: | --- |
| Performance e Core Web Vitals (P06) | 58 | a medir | limpo |
| Acessibilidade WCAG (P09) | 52 | a medir | limpo |
| SEO técnico (P10) | 44 | a medir | limpo |
| Segurança técnica (P07) | 42 | a medir | limpo |
| Conversão crítica (P04) | 57 | a medir | meio de voo |
| Conteúdo, copy e E-E-A-T (P12) | 33 | a medir | meio de voo |
| UX, UI e design system (P11) | a apurar | a medir | meio de voo |
| Infra, CI/CD e DX (P03/P05/P08) | a apurar | a medir | meio de voo |
| Analytics e aquisição (P14) | a apurar | a medir | meio de voo |
| Ética e regulatório (P17) | a apurar | a medir | meio de voo |

### Lighthouse por página, medido

| Página | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Home, celular, depois | 91 | 96 | 100 | 100 | 3,3 s | 0 |
| Perfil de profissional, celular | 98 | 100 | 100 | 100 | 2,3 s | 0 |

As 31 páginas de profissional, que nasceram nesta sessão, são hoje as melhores
páginas do site em todos os quatro eixos. O que ainda pesa nelas é artefato do
laboratório: o servidor de teste não envia `Cache-Control` nem compressão, o
que o Lighthouse cobra como se fosse falha do site.

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
