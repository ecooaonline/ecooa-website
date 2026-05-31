// Avaliações reais de pacientes no Google (perfil ecooa).
// Regra de conformidade (Etapa 6): apenas avaliações REAIS e verificáveis na fonte.
// Fonte pública: https://www.google.com/maps/place/ecooa
// Exibição: somente iniciais (privacidade), sem data, texto da avaliação. Todas 5 estrelas.
// Não adicionar avaliação que não exista no perfil do Google.

export interface Review {
  initials: string;
  text: string;
}

export const GOOGLE_REVIEWS_URL = 'https://share.google/QyXPdoNr8SI2QrS66';

export const reviews: Review[] = [
  {
    initials: 'F. D.',
    text: 'Clínica maravilhosa! Ótima recepção, profissionais competentes e focados no bem estar do paciente.',
  },
  {
    initials: 'L. S.',
    text: 'Melhor clínica de Porto Alegre, ambiente aconchegante e um atendimento impecável!',
  },
  {
    initials: 'T. B.',
    text: 'Muito agradável e acolhedor, fui muito bem recepcionada e recebi um ótimo atendimento! Super indico!',
  },
  {
    initials: 'P. M.',
    text: 'Lugar maravilhoso. Um tratamento mais do que especial. Profissionais maravilhosos.',
  },
  {
    initials: 'V. G.',
    text: 'Profissionais competentes e atualizados. Equipe multidisciplinar, com medicina integrativa, nutrição e diversas especialidades. Ambiente acolhedor. Recomendo de olhos fechados!',
  },
  {
    initials: 'R. N.',
    text: 'Clínica maravilhosa! Profissionais excelentes. Nota 10 para toda a equipe.',
  },
  {
    initials: 'F. S.',
    text: 'A clínica e os profissionais são excelentes. Ambiente acolhedor, aconchegante e lindo! Dr. Gustavo sempre íntegro e transparente, tenho total confiança nele. Super indico!',
  },
  {
    initials: 'M. D.',
    text: 'A ecooa tem meu coração! Profissionais maravilhosos além de ser uma clínica linda.',
  },
  {
    initials: 'S. B.',
    text: 'Melhor clínica e equipe do mundo! Amo toda vez que vou na ecooa.',
  },
  {
    initials: 'C. L.',
    text: 'A clínica ecooa está linda! Desde a recepção já senti a ótima energia do local. Consulto com a psicóloga Manuela e me sinto melhor a cada dia. Parabéns a toda a equipe!',
  },
  {
    initials: 'L. O.',
    text: 'Ambiente moderno e acolhedor. Recepcionistas muito simpáticas e atenciosas. Excelentes profissionais. Super recomendo!',
  },
  {
    initials: 'C. B.',
    text: 'Desde a chegada na clínica até o atendimento foi excelente. Sempre muito atenciosos. Ambiente agradável e bonito. Estou muito satisfeita com os procedimentos estéticos.',
  },
  {
    initials: 'B. M.',
    text: 'Ótima, super indico! Profissionais excelentes e ambiente super agradável.',
  },
  {
    initials: 'N. B.',
    text: 'Lugar lindo, agradável, profissionais competentes.',
  },
  {
    initials: 'P. A.',
    text: 'Melhor clínica! Atendimento impecável! Só profissionais excelentes. Recomendo demais!',
  },
  {
    initials: 'R. L.',
    text: 'Ótimo atendimento. Espaço lindo e profissionais bem atenciosos.',
  },
  {
    initials: 'B. D.',
    text: 'A nutricionista Renata é excepcional, detalhista e minuciosa. Recomendo!',
  },
  {
    initials: 'T. D.',
    text: 'Lugar lindo, recheado de profissionais incríveis preparados para nos receber.',
  },
  {
    initials: 'J. R.',
    text: 'A clínica reúne profissionais extremamente qualificados em um ambiente acolhedor e moderno. Recomendo!',
  },
  {
    initials: 'N. M.',
    text: 'Atendimento primoroso, ótimo café, sem espera e com todo zelo e cuidado. Vista maravilhosa da cidade. Recomendo.',
  },
  {
    initials: 'M. M.',
    text: 'Clínica maravilhosa, profissionais excelentes! Atendimento top! Parabéns.',
  },
  {
    initials: 'J. M.',
    text: 'Uma clínica aconchegante com excelentes profissionais. A minha nutricionista é a melhor, com atendimento vip. Super recomendo.',
  },
  {
    initials: 'M. F.',
    text: 'Atendimento excelente! Lugar lindo e aconchegante. A nutricionista é nota mil, profissional exemplar. Super recomendo a clínica.',
  },
  {
    initials: 'V. D.',
    text: 'Experiência incrível na clínica! Todos profissionais excelentes. Dr. Gustavo extremamente atencioso e competente. Não troco nunca mais.',
  },
  {
    initials: 'A. G.',
    text: 'Clínica linda, aconchegante e com profissionais super qualificados!',
  },
  {
    initials: 'K. L.',
    text: 'Excelente clínica com ótimos profissionais e atendimento. Ambiente lindo e aconchegante.',
  },
  {
    initials: 'I. L.',
    text: 'Melhor clínica de Porto Alegre! Atualizada e com profissionais muito competentes.',
  },
  {
    initials: 'E. H.',
    text: 'Clínica linda! Ótimo atendimento. Parabéns em especial à nutricionista Renata Moura.',
  },
  {
    initials: 'M. C.',
    text: 'Maravilhosos. A clínica é linda e o atendimento é vip. A localização é perfeita.',
  },
  {
    initials: 'G. P.',
    text: 'Clínica com profissionais incríveis, que ofertam todo suporte e cuidado ao paciente.',
  },
  {
    initials: 'F. B.',
    text: 'Super bem localizado, fácil acesso. Ambiente amplo e lindo. Nutricionista excepcional, recomendo muito.',
  },
  {
    initials: 'C. C.',
    text: 'A saúde sob uma nova e fantástica perspectiva, impressionante! Parabéns Dr. Gustavo Gehrke e equipe!',
  },
  {
    initials: 'B. Z.',
    text: 'Clínica linda, aconchegante, com profissionais qualificados que prezam pela saúde e bem estar! Parabéns.',
  },
  {
    initials: 'T. M.',
    text: 'Maravilhoso o atendimento da clínica! Profissionais muito competentes e atenciosos. Estou tendo resultados maravilhosos!',
  },
  {
    initials: 'F. L.',
    text: 'Se tivesse mais estrelas eu daria sem dúvida! Obrigada por cuidarem tão bem da gente.',
  },
  {
    initials: 'A. R.',
    text: 'Local extremamente acolhedor com profissionais altamente qualificados. A experiência de estar na ecooa é única, recomendo!',
  },
];

// Usado no schema (aggregateRating) e no selo visual. Todas as avaliações são 5 estrelas.
export const REVIEW_RATING = '5.0';
export const REVIEW_COUNT = reviews.length;
