// Dados estruturados (JSON-LD) do site publicado.
//
// Diagnóstico que originou este script: a home, a página de localização, a de
// profissionais, a de especialidades e a do editorial não tinham NENHUM dado
// estruturado. Só os 14 artigos (Article) e as 8 áreas (FAQPage) tinham. Para
// uma clínica local, a entidade MedicalClinic com endereço, telefone e horário
// é o sinal central de busca local, e ela simplesmente não existia.
//
// Todo dado aqui vem do que já está publicado em deploy/localizacao.html e em
// deploy/dados-ecooa.js. Nada é inventado. Não há aggregateRating nem review:
// além de não existirem avaliações no site, exibir nota agregada em publicidade
// médica é vedado pelo CFM.
//
// A coordenada geográfica fica de fora de propósito: não temos o valor exato e
// chutar coordenada prejudica o pareamento com o Perfil da Empresa no Google.
// Consta em docs/mythos/PENDENCIAS-DO-DONO.md.
//
// Idempotente: marca cada página com data-ld-ecooa e não duplica.
// Roda DEPOIS de perfis.mjs. Uso: node scripts/estruturados.mjs
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const D = 'https://www.somosecooa.com.br';
const MARCA = 'data-ld-ecooa';

global.window = {};
await import(path.join(DEPLOY, 'dados-ecooa.js'));
const ECOOA = global.window.ECOOA;

/* NAP exatamente como publicado em deploy/localizacao.html */
const CLINICA_ID = `${D}/#clinica`;
const ENDERECO = {
  '@type': 'PostalAddress',
  streetAddress: 'Rua Mariante, 180, 9º andar',
  addressLocality: 'Porto Alegre',
  addressRegion: 'RS',
  postalCode: '90430-180',
  addressCountry: 'BR',
};
const HORARIO = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '20:00',
  },
];

const CLINICA = {
  '@type': 'MedicalClinic',
  '@id': CLINICA_ID,
  name: 'ecooa',
  alternateName: 'Clínica ecooa',
  url: D + '/',
  logo: `${D}/assets/logo/ecooa-wordmark.svg`,
  image: `${D}/assets/fotos/recepcao-hero.webp`,
  description:
    'Clínica multidisciplinar de saúde em Moinhos de Vento, Porto Alegre. Medicina, nutrição, saúde mental, saúde integrativa, tricologia, transplante capilar e estética, com profissionais autônomos que respondem tecnicamente pelo próprio trabalho.',
  telephone: '+55-51-99146-0909',
  email: 'ecooa.adm@gmail.com',
  address: ENDERECO,
  openingHoursSpecification: HORARIO,
  areaServed: [
    { '@type': 'City', name: 'Porto Alegre' },
    { '@type': 'AdministrativeArea', name: 'Rio Grande do Sul' },
  ],
  sameAs: ['https://www.instagram.com/somos.ecooa/'],
  hasMap:
    'https://www.google.com/maps/search/?api=1&query=ecooa%20Rua%20Mariante%20180%20Moinhos%20de%20Vento%20Porto%20Alegre',
  availableService: ECOOA.especialidades.map((e) => ({
    '@type': 'Service',
    name: e.nome,
    url: `${D}/especialidades/${e.slug}/`,
  })),
  knowsAbout: ECOOA.especialidades.map((e) => e.nome),
};

const SITE = {
  '@type': 'WebSite',
  '@id': `${D}/#site`,
  url: D + '/',
  name: 'ecooa',
  inLanguage: 'pt-BR',
  publisher: { '@id': CLINICA_ID },
  /* o ecooa.match aceita ?q= e devolve o resultado pronto */
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${D}/qual-profissional-procurar?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const grafo = (nos) => JSON.stringify({ '@context': 'https://schema.org', '@graph': nos });

function trilha(itens) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it[0],
      item: it[1],
    })),
  };
}

/* o que cada página recebe */
const PLANO = new Map();

PLANO.set('index.html', () => grafo([CLINICA, SITE]));

PLANO.set('localizacao.html', () =>
  grafo([
    CLINICA,
    {
      '@type': 'WebPage',
      '@id': `${D}/localizacao#pagina`,
      url: `${D}/localizacao`,
      name: 'Localização da ecooa em Moinhos de Vento, Porto Alegre',
      about: { '@id': CLINICA_ID },
      breadcrumb: trilha([
        ['Início', D + '/'],
        ['Localização', `${D}/localizacao`],
      ]),
    },
  ])
);

PLANO.set('profissionais.html', () =>
  grafo([
    {
      '@type': 'CollectionPage',
      '@id': `${D}/profissionais#pagina`,
      url: `${D}/profissionais`,
      name: 'Profissionais da ecooa',
      isPartOf: { '@id': `${D}/#site` },
      about: { '@id': CLINICA_ID },
      breadcrumb: trilha([
        ['Início', D + '/'],
        ['Profissionais', `${D}/profissionais`],
      ]),
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: ECOOA.profissionais.length,
        itemListElement: ECOOA.profissionais.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${D}/profissionais/${p.slug}/`,
          name: p.nome,
        })),
      },
    },
  ])
);

PLANO.set('especialidades.html', () =>
  grafo([
    {
      '@type': 'CollectionPage',
      '@id': `${D}/especialidades#pagina`,
      url: `${D}/especialidades`,
      name: 'Especialidades da ecooa',
      isPartOf: { '@id': `${D}/#site` },
      about: { '@id': CLINICA_ID },
      breadcrumb: trilha([
        ['Início', D + '/'],
        ['Especialidades', `${D}/especialidades`],
      ]),
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: ECOOA.especialidades.length,
        itemListElement: ECOOA.especialidades.map((e, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${D}/especialidades/${e.slug}/`,
          name: e.nome,
        })),
      },
    },
  ])
);

PLANO.set('blog.html', () =>
  grafo([
    {
      '@type': 'Blog',
      '@id': `${D}/blog#pagina`,
      url: `${D}/blog`,
      name: 'Editorial ecooa',
      inLanguage: 'pt-BR',
      publisher: { '@id': CLINICA_ID },
      breadcrumb: trilha([
        ['Início', D + '/'],
        ['Editorial', `${D}/blog`],
      ]),
      blogPost: ECOOA.artigos.map((a) => ({
        '@type': 'BlogPosting',
        headline: a.titulo,
        url: `${D}/blog/${a.slug}/`,
        datePublished: a.data,
      })),
    },
  ])
);

PLANO.set('sobre.html', () =>
  grafo([
    CLINICA,
    {
      '@type': 'AboutPage',
      '@id': `${D}/sobre#pagina`,
      url: `${D}/sobre`,
      name: 'Sobre a ecooa',
      about: { '@id': CLINICA_ID },
      breadcrumb: trilha([
        ['Início', D + '/'],
        ['Sobre', `${D}/sobre`],
      ]),
    },
  ])
);

PLANO.set('qual-profissional-procurar.html', () =>
  grafo([
    {
      '@type': 'WebApplication',
      '@id': `${D}/qual-profissional-procurar#app`,
      url: `${D}/qual-profissional-procurar`,
      name: 'ecooa.match',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      inLanguage: 'pt-BR',
      description:
        'Ferramenta de busca da ecooa: você descreve a queixa com as suas palavras e recebe a indicação dos profissionais mais adequados, com o que cada um faz por aquela queixa.',
      provider: { '@id': CLINICA_ID },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
      breadcrumb: trilha([
        ['Início', D + '/'],
        ['Busca por IA', `${D}/qual-profissional-procurar`],
      ]),
    },
  ])
);

for (const [arq, rota, nome, desc] of [
  ['mentorias.html', 'mentorias', 'Mentorias ecooa.cademy', 'Mentoria e formação para profissionais de saúde.'],
  ['sublocacao.html', 'sublocacao', 'Sublocação de sala na ecooa', 'Sublocação de sala para profissionais de saúde em Moinhos de Vento, Porto Alegre.'],
]) {
  PLANO.set(arq, () =>
    grafo([
      {
        '@type': 'Service',
        '@id': `${D}/${rota}#servico`,
        name: nome,
        description: desc,
        url: `${D}/${rota}`,
        provider: { '@id': CLINICA_ID },
        areaServed: { '@type': 'City', name: 'Porto Alegre' },
        breadcrumb: trilha([
          ['Início', D + '/'],
          [nome, `${D}/${rota}`],
        ]),
      },
    ])
  );
}

/* páginas de área: acrescenta trilha e vínculo com a clínica, sem tocar no FAQPage */
for (const e of ECOOA.especialidades) {
  PLANO.set(`especialidades/${e.slug}/index.html`, () =>
    grafo([
      {
        '@type': 'MedicalWebPage',
        '@id': `${D}/especialidades/${e.slug}/#pagina`,
        url: `${D}/especialidades/${e.slug}/`,
        name: `${e.nome} em Porto Alegre`,
        inLanguage: 'pt-BR',
        about: { '@id': CLINICA_ID },
        breadcrumb: trilha([
          ['Início', D + '/'],
          ['Especialidades', `${D}/especialidades`],
          [e.nome, `${D}/especialidades/${e.slug}/`],
        ]),
      },
    ])
  );
}

/* artigos: acrescenta apenas a trilha, o Article já existe */
for (const a of ECOOA.artigos) {
  PLANO.set(`blog/${a.slug}/index.html`, () =>
    grafo([
      trilha([
        ['Início', D + '/'],
        ['Editorial', `${D}/blog`],
        [a.titulo, `${D}/blog/${a.slug}/`],
      ]),
    ])
  );
}

let aplicadas = 0;
let puladas = 0;
for (const [rel, gera] of PLANO) {
  const arq = path.join(DEPLOY, rel);
  if (!fs.existsSync(arq)) {
    puladas++;
    continue;
  }
  let html = fs.readFileSync(arq, 'utf8');
  if (html.includes(MARCA)) {
    /* substitui o bloco anterior, para o script poder rodar de novo */
    html = html.replace(
      new RegExp(`<script type="application/ld\\+json" ${MARCA}>[\\s\\S]*?</script>\\n?`),
      ''
    );
  }
  const bloco = `<script type="application/ld+json" ${MARCA}>${gera()}</script>\n`;
  html = html.replace('</body>', bloco + '</body>');
  fs.writeFileSync(arq, html, 'utf8');
  aplicadas++;
}

/* cópias de diretório herdam o mesmo bloco da página raiz */
for (const [de, para] of [
  ['especialidades.html', 'especialidades/index.html'],
  ['profissionais.html', 'profissionais/index.html'],
  ['blog.html', 'blog/index.html'],
]) {
  const orig = path.join(DEPLOY, de);
  const dest = path.join(DEPLOY, para);
  if (!fs.existsSync(orig) || !fs.existsSync(dest)) continue;
  const m = fs.readFileSync(orig, 'utf8').match(new RegExp(`<script type="application/ld\\+json" ${MARCA}>[\\s\\S]*?</script>`));
  if (!m) continue;
  let html = fs.readFileSync(dest, 'utf8');
  html = html.replace(new RegExp(`<script type="application/ld\\+json" ${MARCA}>[\\s\\S]*?</script>\\n?`), '');
  html = html.replace('</body>', m[0] + '\n</body>');
  fs.writeFileSync(dest, html, 'utf8');
  aplicadas++;
}

console.log(`dados estruturados: ${aplicadas} páginas marcadas${puladas ? `, ${puladas} inexistentes puladas` : ''}`);
