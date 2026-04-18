# PRÓXIMOS PASSOS — Sistema de Intake Profissional

## 🎯 O que foi feito

Implementação **100% completa** de um sistema para:
1. **Coletar dados profissionais** via Google Forms (40 min por profissional)
2. **Alimentar landing pages** de forma humanizada (credenciais, FAQs, caso clínico, preços)
3. **Treinar ecooa.match** com informações reais (dores do paciente, critérios de encaminhamento)
4. **Maximizar SEO individual** (2000+ palavras por profissional, 30 landing pages = 60k palavras)

**Status**: Código + documentação pronta. Build passa. Aguardando dados dos profissionais.

---

## 📋 Checklist Imediato (Hoje ou amanhã)

### Opção Recomendada: Começar agora

1. **Acesse** https://forms.google.com
2. **Crie novo formulário** com esses dados:
   - **Título**: `ecooa | Formulário de Intake Profissional`
   - **Descrição**: Ver em `.claude/intake-form-structure.md` (linhas 10-18)
   - **Campos**: 21 campos em 5 seções (estrutura em `.claude/intake-form-structure.md`)

3. **Integre com Google Sheets** (Forms > Respostas > "Nova planilha")

4. **Copie o link** (será `forms.gle/XXXXX`)

5. **Edite email de distribuição**:
   - Arquivo: `.claude/distribuicao-formulario.md`
   - Seção: "ESTRUTURA DO EMAIL (Copiar-colar direto)"
   - Substitua `https://forms.gle/[seu-link-aqui]` com seu link
   - Substitua `[DATA LIMITE]` com T+7 dias

6. **Envie email para 30 profissionais**:
   ```
   Para: Lista de emails dos 30 profissionais
   Assunto: [ação requerida] Preench seu perfil profissional na ecooa — 40 minutos
   Corpo: Copiar do template em distribuicao-formulario.md
   ```

7. **Confirme comigo** quando form estiver vivo:
   - "Form criado. Link: https://forms.gle/XXXXX"
   - "Emails enviados para os 30"

---

## 📅 Timeline

| Dia | Ação | Responsável |
|-----|------|-------------|
| **T+0** | Criar form + enviar link | você |
| **T+2** | Recordar quem não preencheu | você |
| **T+5** | Último lembrete | você |
| **T+8** | CSV da Google Sheets pronto | você → me avisa |
| **T+8-10** | Processamento de dados | eu |
| **T+10-11** | Validação + commit final | eu |
| **T+11** | Deploy (npm run build + git push) | você |

---

## 🔧 Como Funciona

### Você recebe respostas no Google Sheets

Exemplo de resposta de Gustavo:

```
Email | Nome | Registro | Unidade | Graduação | ... | 10 FAQs | ... | Preço entrada
-----|------|----------|---------|-----------|-----|---------|-----|---------------
...  | Gustavo | CRM/RS 35822 | med | Medicina (UFRGS, 2005) | ... | P: Como é teu emagrecimento? R: Investigamos causa... | ... | 350
```

### Eu processo em 3 passos

1. **Exportar**: Você baixa como CSV
2. **Parsear**: Eu rodo `npx ts-node scripts/processIntakeResponses.ts`
3. **Commit**: `git add -A && git commit -m "feat: intake processado - 30 profissionais com dados completos"`

### Landing pages ganham vida

**Antes** (sem intake):
```
/profissionais/gustavo-gehrke/
├─ Hero (nome, especialidade)
├─ Sobre (descrição)
├─ Especialidades (tags)
├─ Artigos
└─ Profissionais relacionados
```

**Depois** (com intake):
```
/profissionais/gustavo-gehrke/
├─ Hero
├─ Sobre
├─ Credenciais & Formação ← NOVO
├─ Diferencial Clínico ← NOVO
├─ Dúvidas Frequentes (10 pares) ← NOVO
├─ Caso Clínico ← NOVO
├─ Valores & Agendamento ← NOVO
├─ Especialidades
├─ Artigos
└─ Profissionais relacionados
```

---

## 📊 Impacto Esperado

### Por profissional
- **+1800 palavras** na landing page
- **+15-20 keywords** de cauda longa
- **+3 minutos** de tempo médio de página
- **+10 FAQs** públicas e indexadas

### Site inteiro
- **+60k palavras** de conteúdo único
- **+30 páginas** muito mais competitivas em SEO
- **Efeito de rede**: Match fica mais inteligente (entende real o paciente)

---

## 🚀 Como Testar Antes

Se quiser visualizar como fica antes de distribuir:

```bash
# Edite um profissional com dados fake
# src/data/professionals.ts > gustavo-gehrke > adicione:

registration: 'CRM/RS 35822',
education: {
  graduation: 'Medicina (UFRGS, 2005)',
  postgrad: ['Endocrinologia (USP, 2010)'],
  courses: ['Bioimplantes (2019)']
},
clinicalDifferential: 'Abordagem integrativa.',
mainComplaints: ['Dificuldade para emagrecer', 'Cansaço crônico'],
faqPairs: [
  { 
    question: 'Como funciona?', 
    answer: 'Investigamos causas raiz...' 
  }
],
pricing: { firstConsultation: 350, return: 280 }

# Depois:
npm run dev
# Acesse: http://localhost:3000/profissionais/gustavo-gehrke
# Visualize as 6 novas seções
```

---

## 📦 Arquivos para Consultar

### Estrutura do Formulário
- **`.claude/intake-form-structure.md`** ← Use isso para criar o form em Google Forms

### Distribuição
- **`.claude/distribuicao-formulario.md`** ← Email template, FAQ, timeline

### Processamento
- **`.claude/intake-form-processing.md`** ← Script TypeScript para parsear respostas

### Exemplos
- **`.claude/exemplo-profissional-completo.md`** ← Como fica uma landing page completa

### Status
- **`.claude/IMPLEMENTACAO-STATUS.md`** ← Tudo que foi feito, decisões arquiteturais

---

## ❓ FAQ Rápido

**P: E se um profissional não preencher?**
R: Sem problema. Landing page dele renderiza normal (sem as 6 seções novas). Quando ele preencher depois, você roda o script de novo.

**P: E se a resposta for ruim/incompleta?**
R: Você valida e pede para refazer. Google Forms permite respostas "edit" (reabrir link antigo).

**P: Quanto tempo demora processar 30 respostas?**
R: ~30 minutos (eu rodo o script).

**P: Build vai ficar mais lento?**
R: +0.5-1 segundo (de 8s para ~9s). Imperceptível para o usuário.

**P: Preciso fazer merge com main?**
R: Não agora. Sua branch `claude/lighthouse-optimization-KemQJ` fica como está. Depois que tudo estiver pronto (intake processado + validado), fazemos merge.

---

## 🎬 Resumo de Ação

### Hoje
```
1. Criar Google Forms
2. Enviar link para 30 profissionais
3. Avisar-me quando enviado
```

### Próximos 7 dias
```
Você: Acompanhar respostas, fazer follow-up
```

### T+8
```
Você: "Respostas prontas, CSV salvo em scripts/intake-responses.csv"
Eu: Processamento + commit
```

### T+11
```
Você: Deploy (npm run build + git push)
Site: 60k palavras novas, 30 landing pages premium
```

---

## ✅ Tudo Pronto?

- [x] Interface TypeScript expandida
- [x] Landing page com 6 novas seções
- [x] Documentação completa
- [x] Google Forms structure definida
- [x] Script de processamento pronto
- [x] Build passando
- [x] Email template copiar-colar
- [x] Timeline clara

**Aguardando**: Você criar o formulário e distribuir.

---

**Próximo passo**: Me avisa quando form estiver vivo. Daí é só aguardar 7 dias e processar dados.
