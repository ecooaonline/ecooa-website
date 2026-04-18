# PROCESSAMENTO DE RESPOSTAS — Intake Profissional

## Fluxo Completo

1. **Google Forms** coleta respostas de 30 profissionais
2. **Google Sheets** integrada armazena as respostas (link gerado após criar form)
3. **Script de parsing** transforma linhas da planilha em objetos Professional expandidos
4. **professionals.ts** é atualizado com dados de intake
5. **Landing pages** são geradas automaticamente com os novos dados
6. **ecooa.match** é retreinado com FAQ, casos clínicos, critérios de encaminhamento

---

## Mapeamento: Google Forms → professionals.ts

### Estrutura de Resposta do Forms

Quando um profissional preenche o intake, a resposta chega como linha no Google Sheets com colunas:

| Email | Nome | Registro | Unidade | Graduação | Pós | Residência | Cursos | Especialidades | Diferencial | Não Atende | Descrição | Frase Inspiradora | 3 Queixas | 10 FAQs | Critérios Para | Critérios Para Fora | Caso Clínico | Preço Entrada | Preço Retorno | Pacotes |
|-------|------|----------|---------|-----------|-----|-----------|--------|----------------|-------------|-----------|-----------|------------------|-----------|---------|----------------|-------------------|-------------|---------------|----------------|---------|

### Transformação para Professional Interface

```typescript
// Exemplo: Gustavo Gehrke preencheu o intake

const formResponse = {
  email: 'gustavo@ecooa.med',
  nome: 'Gustavo Gehrke',
  registro: 'CRM/RS 35822',
  unidade: 'med',
  graduacao: 'Medicina (UFRGS, 2005)',
  pos: 'Endocrinologia (USP, 2010); Metabolismo (USP, 2012)',
  residencia: 'Clínica Médica (Hospital de Clínicas, 2005-2007)',
  cursos: 'Tricologia Clínica (ISOS, 2015); Harmonização Orofacial (módulo avançado, 2018)',
  especialidades: 'Metabolismo, Hormônios, Emagrecimento, Longevidade, Estilo de Vida',
  diferencial: 'Abordagem integrativa que une medicina e estilo de vida para resultados sustentáveis',
  naoAtende: 'Não atendo casos puramente estéticos sem componente hormonal',
  descricao: 'Médico generalista com 15 anos de experiência em metabolismo e hormônios...',
  fraseInspiadora: 'Saúde de verdade começa por entender o próprio corpo',
  '3Queixas': '1. Dificuldade para emagrecer\n2. Cansaço crônico\n3. Ganho de peso sem causa óbvia',
  '10FAQs': 'P: Qual diferença do seu emagrecimento?\nR: Entendemos que é metabolismo...\n\nP: Quanto tempo leva?',
  criteriosPara: '- Paciente com dificuldade de emagrecimento\n- Paciente com cansaço crônico',
  criteriosParaFora: 'Se puramente estética, encaminho para ecooa.esthetic',
  casoClinico: 'Paciente, 42 anos, mulher, executiva...',
  precoEntrada: '350',
  precoRetorno: '280',
  pacotes: 'Protocolo 12 semanas: R$ 2.400'
};

// ↓ Transforma em:

const professional: Professional = {
  slug: 'gustavo-gehrke',
  name: 'Gustavo Gehrke',
  role: 'Médico Generalista · Metabolismo · Hormônios · Emagrecimento · Estilo de Vida',
  unit: 'med',
  photo: '/team/gustavo.webp',
  ig: '@gustavogehrke',
  description: 'Médico generalista com 15 anos de experiência...',
  tags: ['Metabolismo', 'Hormônios', 'Emagrecimento', 'Longevidade', 'Estilo de Vida'],
  isFounder: true,
  personalTouch: 'Saúde de verdade começa por entender o próprio corpo',

  // Novos campos do intake
  registration: 'CRM/RS 35822',
  education: {
    graduation: 'Medicina (UFRGS, 2005)',
    postgrad: ['Endocrinologia (USP, 2010)', 'Metabolismo (USP, 2012)'],
    residency: 'Clínica Médica (Hospital de Clínicas, 2005-2007)',
    courses: ['Tricologia Clínica (ISOS, 2015)', 'Harmonização Orofacial (módulo avançado, 2018)']
  },
  specialties: ['Metabolismo', 'Hormônios', 'Emagrecimento', 'Longevidade', 'Estilo de Vida'],
  clinicalDifferential: 'Abordagem integrativa que une medicina e estilo de vida para resultados sustentáveis',
  areasNotServed: 'Não atendo casos puramente estéticos sem componente hormonal; encaminho para ecooa.esthetic',
  mainComplaints: [
    'Dificuldade para emagrecer apesar de dieta e exercício',
    'Cansaço e falta de energia crônica',
    'Desconforto com corpo / composição corporal'
  ],
  faqPairs: [
    {
      question: 'Qual é a diferença entre seu emagrecimento e uma dieta comum?',
      answer: 'Entendemos que emagrecimento é resultado de metabolismo funcional, não de restrição calórica...'
    },
    {
      question: 'Quanto tempo leva para ver resultado?',
      answer: 'Depende do caso. Muitos pacientes sentem diferença em energia em 2-3 semanas...'
    }
    // ... mais 8 pares
  ],
  referralCriteriaFor: [
    'Paciente com dificuldade de emagrecimento + histórico de dietas fracassadas',
    'Paciente com cansaço crônico + desejo de otimizar saúde metabólica',
    'Paciente com ganho de peso sem causa óbvia'
  ],
  referralCriteriaAway: 'Se é questão puramente estética, encaminho para ecooa.esthetic. Se é saúde mental como causa raiz, sugiro avaliação com ecooa.mind antes.',
  caseStudy: 'Paciente, 42 anos, mulher, executiva. Queixa: ganhou 12kg em 18 meses apesar de exercício...',
  pricing: {
    firstConsultation: 350,
    return: 280,
    packages: ['Protocolo 12 semanas: R$ 2.400 (4 consultas + acompanhamento)']
  }
};
```

---

## Script de Parsing (TypeScript)

Quando as respostas chegarem, use este script para parsear a planilha Google Sheets:

```typescript
// scripts/processIntakeResponses.ts

import * as fs from 'fs';
import { Professional } from '../src/data/professionals';

interface FormResponse {
  [key: string]: string;
}

function parseEducation(graduation: string, postgrad: string, residency: string, courses: string) {
  return {
    graduation: graduation.trim(),
    postgrad: postgrad.split(';').map(p => p.trim()).filter(p => p),
    residency: residency.trim() || undefined,
    courses: courses.split(';').map(c => c.trim()).filter(c => c)
  };
}

function parseSpecialties(specialties: string): string[] {
  return specialties.split(',').map(s => s.trim()).filter(s => s);
}

function parseMainComplaints(complaints: string): string[] {
  return complaints.split('\n').map(c => c.trim()).filter(c => c && !c.match(/^\d\./));
}

function parseFAQs(faqText: string): Array<{ question: string; answer: string }> {
  const pairs: Array<{ question: string; answer: string }> = [];
  const blocks = faqText.split('\n\n');

  blocks.forEach(block => {
    const lines = block.split('\n');
    let question = '';
    let answer = '';

    lines.forEach(line => {
      if (line.startsWith('P:')) {
        question = line.replace(/^P:\s*/, '').trim();
      } else if (line.startsWith('R:')) {
        answer = line.replace(/^R:\s*/, '').trim();
      }
    });

    if (question && answer) {
      pairs.push({ question, answer });
    }
  });

  return pairs;
}

function parseReferralCriteria(criteria: string): string[] {
  return criteria.split('\n').map(c => c.trim()).filter(c => c && !c.match(/^-/)).map(c => c.replace(/^-\s*/, ''));
}

function parsePackages(packages: string): string[] {
  return packages.split('\n').map(p => p.trim()).filter(p => p);
}

function transformFormResponseToProfessional(
  response: FormResponse,
  existingProfessional: Professional
): Professional {
  return {
    ...existingProfessional,
    registration: response['Registro'] || undefined,
    education: parseEducation(
      response['Graduação'],
      response['Pós'] || '',
      response['Residência'] || '',
      response['Cursos'] || ''
    ),
    specialties: parseSpecialties(response['Especialidades']),
    clinicalDifferential: response['Diferencial'] || undefined,
    areasNotServed: response['Não atende'] || undefined,
    mainComplaints: parseMainComplaints(response['3 queixas']),
    faqPairs: parseFAQs(response['10 FAQs']),
    referralCriteriaFor: parseReferralCriteria(response['Critérios Para']),
    referralCriteriaAway: response['Critérios Para Fora'] || undefined,
    caseStudy: response['Caso clínico'] || undefined,
    pricing: {
      firstConsultation: parseInt(response['Preço entrada'], 10),
      return: parseInt(response['Preço retorno'], 10),
      packages: response['Pacotes'] ? parsePackages(response['Pacotes']) : undefined
    }
  };
}

export { transformFormResponseToProfessional, FormResponse };
```

---

## Como Executar o Processamento

1. **Exporte as respostas** do Google Sheets como CSV
2. **Coloque** na pasta `scripts/` com nome `intake-responses.csv`
3. **Rode** o script de transformação:
   ```bash
   npx ts-node scripts/processIntakeResponses.ts
   ```
4. **Verifique** `src/data/professionals.ts` foi atualizado corretamente
5. **Commit e push** as mudanças

---

## Checklist de Validação Pós-Processamento

- [ ] Todos os 30 profissionais foram mapeados
- [ ] `registration` foi preenchido com formatação correta (CRM/RS, CRN, CRP, etc)
- [ ] `specialties` refletem domínios únicos de cada profissional
- [ ] `faqPairs` têm máximo 10 pares e textos completos
- [ ] `mainComplaints` têm exatamente 3 itens
- [ ] `pricing.firstConsultation` e `.return` são números válidos
- [ ] `caseStudy` não contém identificação de paciente
- [ ] Links de foto (`/team/*.webp`) ainda existem
- [ ] Build passa sem erros: `npm run build`

---

## Integração com ecooa.match

Após processamento, o sistema pode:

1. **Extrair novos sinônimos** de `mainComplaints` e `faqPairs` para enriquecer SYNONYM_CLUSTERS
2. **Calcular topSlugs** em curatedIntents baseado em `referralCriteriaFor` de cada profissional
3. **Gerar FAQ dinâmico** na landing page de cada profissional a partir de `faqPairs`
4. **Exibir pricing** nas cards de resultado do match
5. **Melhorar match score** usando `clinicalDifferential` e `specialties` para resolução semântica

---

## Timeline

- **T+0**: Criar Google Form e distribuir link
- **T+48h**: Recordar profissionais (deadline = T+7d)
- **T+7d**: Coletar respostas finais
- **T+8d**: Rodar processamento de intake
- **T+9d**: Validar dados e atualizar landing pages
- **T+10d**: Retreinar ecooa.match e publicar site v2.1
