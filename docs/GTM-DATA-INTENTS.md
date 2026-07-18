# Taxonomia data-intent · GTM-TSR4GDMK

> Fonte única dos valores de `data-intent` no site após a reformulação B2C.
> Gatilhos do GTM configurados na taxonomia antiga (ex.: `peso-seguro`, `queda-capilar`, `hormonios`, `check-up`, `meu-cabelo`, `ansiedade`, `esgotamento`, `emagrecer`) pararam de existir e precisam ser migrados para os valores abaixo.
> Convenção: `pagina-secao-dor`. Última atualização: Onda 4 da reformulação.

## Como usar no GTM

1. Gatilho de clique em elemento com atributo `data-intent` (variável de camada: `Click Element` → atributo `data-intent`).
2. Enviar o valor como `event_label` do evento de conversão.
3. A métrica norte é: cliques de WhatsApp qualificados por dor (intents de espelho, protocolo e programa).

## Globais (todas as páginas)

| Intent | Elemento |
|--------|----------|
| `fab-whatsapp` | Botão flutuante de WhatsApp |
| `faq-whatsapp` | Link "tirar essa dúvida no whatsapp" em qualquer FAQ |
| `cta-section` | CTA de fechamento padrão (CtaSection) |

## Home (/)

| Intent | Elemento |
|--------|----------|
| `homepage-hero` | Link WhatsApp do hero |
| `home-matchbar` | Envio da MatchBar ("encontrar meu especialista") |
| `home-espelho-dietas` · `home-espelho-cabelo` · `home-espelho-espelho` · `home-espelho-ansiedade` · `home-espelho-exames` · `home-espelho-neutra` | Frases clicáveis do espelho |
| `home-jornada` | CTA "começar pela primeira conversa" (seção 3 atos) |

## Medicina (/ecooa-med)

| Intent | Elemento |
|--------|----------|
| `med-hero` | CTA do hero |
| `med-espelho-balanca` · `med-espelho-cabelo` · `med-espelho-cansaco` · `med-espelho-libido` · `med-espelho-menopausa` · `med-espelho-neutra` | Espelho por queixa |
| `med-quiz-submit` · `med-quiz-resultado` | Mini-quiz do Método Gehrke 360° |
| `med-protocolo-peso-seguro` · `med-protocolo-tricometabolico` · `med-protocolo-bioimplantes` · `med-protocolo-hormonal-feminina` · `med-protocolo-hormonal-masculina` · `med-protocolo-performance` · `med-protocolo-longevidade` · `med-protocolo-checkup` | CTAs dos protocolos |
| `med-primeiro-passo` | Fechamento "Traga seus exames" |

## Estética (/ecooa-esthetic)

| Intent | Elemento |
|--------|----------|
| `esthetic-hero` | CTA do hero |
| `esthetic-espelho-cabelo` · `esthetic-espelho-transplante` · `esthetic-espelho-rosto` · `esthetic-espelho-pele` · `esthetic-espelho-corpo` · `esthetic-espelho-neutra` | Espelho por porta |
| `esthetic-empatia` | CtaBand após a empatia |
| `esthetic-transplante-destaque` | CTA "avaliar meu caso de transplante" |
| `esthetic-primeiro-passo` | Fechamento |

## Saúde mental (/ecooa-mind)

| Intent | Elemento |
|--------|----------|
| `mind-hero` | CTA "agendar sessão de acolhimento" |
| `mind-espelho-cansaco` · `mind-espelho-ansiedade` · `mind-espelho-automatico` · `mind-espelho-esgotamento` · `mind-espelho-compulsao` · `mind-espelho-neutra` | Espelho |
| `mind-primeiro-passo` | Fechamento |

## Nutrição (/ecooa-working)

| Intent | Elemento |
|--------|----------|
| `working-hero` | CTA "agendar minha avaliação" |
| `working-espelho-dietas` · `working-espelho-culpa` · `working-espelho-canetas` · `working-espelho-esportiva` · `working-espelho-vegana` · `working-espelho-estetica` | Espelho |
| `working-empatia` | CtaBand "quero começar diferente" |
| `working-bioimpedancia` | Card da oferta de entrada |
| `working-programa-paz` · `working-programa-emagrecimento` · `working-programa-canetas` · `working-programa-performance` · `working-programa-vegana` · `working-programa-beleza` | CTAs dos programas |
| `working-primeiro-passo` | Fechamento |

## Institucional e B2B

| Intent | Elemento |
|--------|----------|
| `quem-somos-carta` | CtaBand após a carta dos fundadores |
| `b2b-hero` · `b2b-cta-final` | /para-profissionais |
| `b2b-nutri-hero` | /para-nutricionistas |
| `profissionais-match` | Página de profissionais |
| `obrigado-whatsapp` · `obrigado-blog` · `obrigado-instagram` | Página /obrigado |

## Dinâmicos (ecooa.match)

| Intent | Elemento |
|--------|----------|
| `match-wa-{slug}` | WhatsApp direto do resultado do match |
| `match-form-{slug}` | Formulário via match |
| `match-profile-{slug}` | Perfil do profissional via match |

*Documento gerado a partir do código. Regenerar após qualquer mudança de intents com: `grep -rhoP 'data-intent="[^"]+"|intent: "[^"]+"' src/ | sort -u`*
