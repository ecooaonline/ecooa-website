# Workflow Newsletter — ecooa

Newsletter quinzenal sobre saúde integrativa, metabolismo, nutrição, estética e longevidade. Canal direto com subscribers para nurturing e retorno à clínica.

---

## Stack

| Componente | Implementação |
|-----------|---------------|
| Captura de email | `src/components/NewsletterCapture.astro` (3 variants: inline, banner, footer) |
| Backend | Google Apps Script (`google-apps-script.js`), salva em sheet `newsletter` |
| Geração de draft | Função `generateNewsletterDigest()` no mesmo GAS, lê RSS feed + sheet de subscribers |
| Envio final | Manual pelo time (copia/cola do draft + ajustes em Gmail ou Mailchimp) |
| Unsubscribe | Link no rodapé de cada email enviado |

---

## Fluxo operacional

### 1. Captura (automática, 24/7)

Visitante entra em qualquer página que tenha `NewsletterCapture`, digita email, submete. Form envia para Google Apps Script, que:

1. Valida email
2. Checa rate limit (10 envios/hora por IP)
3. Adiciona linha na aba `newsletter` do Google Sheets
4. Envia email de notificação interna ao time

### 2. Geração do draft (automática, biweekly)

Trigger time-driven no Google Apps Script roda a função `generateNewsletterDigest()` a cada 2 semanas (segunda-feira, 9h). Ela:

1. Faz fetch do RSS feed em `https://www.somosecooa.com.br/rss.xml`
2. Extrai os 3 posts mais recentes (title, link, description)
3. Lê contagem de subscribers na sheet `newsletter`
4. Monta HTML de draft e envia como email para `ecooa.adm@gmail.com`

O draft **não vai direto aos subscribers**. É preview interno.

### 3. Revisão e envio (manual, quinzenal)

Quem recebe o draft:

1. Abre o email em `ecooa.adm@gmail.com`
2. Revisa os 3 posts sugeridos, ajusta ordem se necessário
3. Adiciona copy de abertura personalizada (1-2 frases contextualizando a edição)
4. Copia o HTML para ferramenta de envio (Gmail com BCC, Mailchimp, Sendinblue, etc.)
5. Envia aos subscribers da sheet `newsletter`

Alvo de tempo: **15 minutos** por edição.

---

## Setup do trigger GAS (manual, uma vez)

No editor do Google Apps Script:

1. Abrir o projeto do script
2. Clicar no ícone de relógio (Triggers) no menu lateral
3. Clicar em "+ Add Trigger"
4. Configurar:
   - **Choose function to run**: `generateNewsletterDigest`
   - **Choose which deployment**: Head
   - **Select event source**: Time-driven
   - **Select type of time based trigger**: Week timer
   - **Select day of week**: Monday
   - **Select time of day**: 9am to 10am
5. Salvar
6. Ajustar manualmente para rodar a cada 2 semanas (GAS não suporta "every other week" nativamente, então uma estratégia é: trigger toda segunda, a função verifica `new Date().getWeek() % 2 === 0` para rodar só em semanas pares; ou apenas rodar toda semana com tolerância)

Sugestão pragmática: rodar toda segunda e deixar o time decidir quais edições aproveitar.

---

## Conformidade LGPD

Toda newsletter enviada deve cumprir:

- [ ] Link de **unsubscribe** visível no rodapé de cada email
- [ ] Identificação clara do remetente (ecooa)
- [ ] Endereço físico do remetente (Rua Mariante, 180, 9º andar, Moinhos de Vento, Porto Alegre, RS, 90430-180)
- [ ] Link para política de privacidade (`/politica-de-privacidade`)
- [ ] **Nunca** comprar lista externa. Usar apenas subscribers que se cadastraram via site
- [ ] Atender requisições de exclusão em até 15 dias (direito do titular)
- [ ] Processo de unsubscribe não pode exigir login ou dados adicionais

### Gestão de unsubscribes

Quando um subscriber solicita unsubscribe:

1. Registrar data na sheet `newsletter`, coluna "Status" mudar para "Descadastrado"
2. Filtrar subscribers com Status != "Descadastrado" antes de cada envio
3. Manter registro por 3 anos para prova de conformidade (direito do controlador)

---

## Métricas-chave

Medir a cada edição:

| Métrica | Fonte | Alvo |
|---------|-------|------|
| Subscribers totais | sheet `newsletter` | crescimento >5%/mês |
| Taxa de abertura | ferramenta de envio | >25% |
| Taxa de clique | ferramenta de envio | >3% |
| Cliques em post | GA4 (filtro utm_source=newsletter) | >20% dos opens |
| Novos agendamentos via newsletter | sheet `agendamento` (data próxima ao envio) | ≥1 por edição |

Adicionar colunas com essas métricas a `docs/content-calendar-template.md` para tracking mensal.

---

## Evolução futura

- [ ] Migrar de envio manual para plataforma (Mailchimp, Sendinblue, Brevo)
- [ ] Automatizar UTM tagging dos links (utm_source=newsletter, utm_medium=email, utm_campaign=YYYY-MM)
- [ ] Segmentar subscribers por interesse (fonte de captura: medicina vs nutrição vs estética)
- [ ] A/B test de subject lines
