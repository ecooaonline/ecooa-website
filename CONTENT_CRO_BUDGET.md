# Content e CRO Budget — ecooa

Política anti-regressão de conteúdo, copy e conversão. Deve ser consultada antes de criar ou editar qualquer página, seção ou componente de copy.

## Regras de conteúdo

| Regra                                              | Detalhe                                                                                         |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Nenhuma página nova sem objetivo claro             | Definir: o que o usuário faz aqui, qual próximo passo                                           |
| Nenhuma página nova sem intenção de busca          | Mapear termo principal antes de escrever o H1                                                   |
| Nenhuma página estratégica sem H1 claro            | H1 deve comunicar categoria + diferencial em uma leitura rápida                                 |
| Nenhuma página estratégica sem title e description | Title: até 60 chars, geo-localizado. Description: até 155 chars, com verbo de ação              |
| Nenhuma seção nova sem função na jornada           | Cada seção responde uma pergunta: o que é, por que confiar, como funciona, qual o próximo passo |
| Nenhum conteúdo duplicado sem justificativa        | Verificar canibalização antes de criar nova página de serviço ou especialidade                  |

## Regras de autoridade e confiança (E-E-A-T)

| Regra                                       | Detalhe                                                                                   |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Nenhum depoimento inventado                 | Apenas avaliações reais do Google (reviews.ts) ou depoimentos com autorização documentada |
| Nenhum dado inventado                       | Números, estatísticas, "X% dos pacientes": só com fonte real e verificável                |
| Nenhuma credencial inventada                | CRM, formação, residência: apenas o que consta no cadastro oficial do profissional        |
| Nenhuma promessa sem sustentação            | "Equipe de 30 profissionais": manter atualizado em professionals.ts                       |
| Nenhum claim absoluto em saúde              | Ver lista de termos proibidos em TONE_OF_VOICE.md                                         |
| Nenhum conteúdo médico/regulado sem cautela | Adicionar DisclaimerMedico nas páginas med e esthetic                                     |
| Nenhum FAQ schema sem FAQ visível           | Schema FAQPage só pode existir se as perguntas estiverem renderizadas na página           |

## Regras de CRO

| Regra                                           | Detalhe                                                                                                                                         |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Nenhuma página sem CTA                          | Toda página estratégica termina com CtaSection ou CTA explícito                                                                                 |
| Nenhum CTA novo sem destino claro               | href definido, destino funcional, mensagem de WhatsApp pré-configurada                                                                          |
| Sistema de CTAs: respeitar a hierarquia         | Primário: "agendar avaliação". Secundário baixa fricção: "falar pelo whatsapp". Contextual: "agendar com [nome]" / "agendar consulta de [área]" |
| Microcopy de erro: sempre com fallback          | Em caso de falha de formulário, exibir o número do WhatsApp como alternativa                                                                    |
| Nenhum formulário sem mensagem de sucesso clara | O usuário deve saber o próximo passo após o envio                                                                                               |

## Regras de SEO on-page

| Regra                                   | Detalhe                                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------------------- |
| Nenhuma alteração de H1 sem revisar SEO | Verificar termo principal e geo antes de mudar                                           |
| Nenhum keyword stuffing                 | Densidade natural; termo principal aparece no H1, primeiro parágrafo e 1-2 H2. Nada mais |
| Nenhum conteúdo escondido para SEO      | Texto visível = texto indexado. Sem display:none com conteúdo                            |
| Nenhuma página sem links internos       | Mínimo 2 links internos contextuais por página de serviço                                |

## Regras de performance e acessibilidade

| Regra                                                | Detalhe                                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Nenhum texto visual longo sem escaneabilidade        | Parágrafos máx. 3-4 linhas. Usar cards, listas, steps quando o conteúdo for denso     |
| Nenhuma imagem com texto crítico                     | Alt text obrigatório e descritivo em OptimizedImage                                   |
| Nenhum conteúdo que prejudique mobile                | Testar em 375px antes de commitar nova seção                                          |
| Nenhuma alteração de copy sem revisar acessibilidade | CTAs com aria-label quando o texto isolado não for claro ("→" precisa de aria-hidden) |

## Revisão periódica

- **Trimestral:** revisar reviews.ts com novas avaliações do Google.
- **Semestral:** auditar H1/title/description de todas as páginas contra Search Console (CTR, posição).
- **A cada novo profissional:** atualizar professionals.ts, não inventar dados.
- **A cada novo serviço:** criar página com estrutura: hero → problema → solução → como funciona → diferenciais → FAQ → CTA. Nunca só uma seção.
