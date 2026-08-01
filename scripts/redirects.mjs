// Pontes das URLs legadas do site anterior.
//
// Diagnóstico da auditoria P10 (2026-08-01): as 16 URLs antigas de
// /especialidade/<tema>/ apontavam todas para o hub /especialidades, mesmo
// existindo a página específica do tema. Quem chegava de um link antigo ou de
// um resultado de busca caía numa listagem e tinha que procurar de novo, e o
// sinal de relevância da URL antiga se perdia no caminho.
//
// Agora cada tema aponta para a área que de fato o cobre. Quando o tema não
// tem página própria (coaching, genetics, longevidade), a ponte leva ao lugar
// mais próximo e honesto.
//
// Limite conhecido: hospedagem estática não emite 301. Estes arquivos são
// pontes de meta refresh com canonical, que o Google trata como redirecionamento
// suave. O 301 de verdade depende do cutover para a Cloudflare, registrado como
// Bloqueio 6 em docs/mythos/PENDENCIAS-DO-DONO.md.
//
// Uso: node scripts/redirects.mjs
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const DOMINIO = 'https://www.somosecooa.com.br';

/* tema legado -> destino atual mais específico que existe */
const DESTINOS = {
  capilar: '/especialidades/tricologia/',
  'nutricao-clinica': '/especialidades/nutricao/',
  'nutricao-esportiva': '/especialidades/nutricao/',
  'nutricao-estetica': '/especialidades/nutricao/',
  vegetarianismo: '/especialidades/nutricao/',
  emagrecimento: '/especialidades/nutricao/',
  metabolismo: '/especialidades/medicina/',
  hormonal: '/especialidades/medicina/',
  longevidade: '/especialidades/medicina/',
  genetics: '/especialidades/medicina/',
  performance: '/especialidades/nutricao/',
  pele: '/especialidades/estetica-facial/',
  'rejuvenescimento-facial': '/especialidades/estetica-facial/',
  corpo: '/especialidades/estetica-corporal/',
  psicologia: '/especialidades/saude-mental/',
  coaching: '/especialidades/saude-mental/',
};

const ponte = (destino, titulo) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Página movida · ecooa</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="0; url=${destino}">
<link rel="canonical" href="${DOMINIO}${destino}">
</head>
<body>
<p>Esta página mudou de endereço. Se o seu navegador não seguir sozinho, <a href="${destino}">abra ${titulo}</a>.</p>
</body>
</html>
`;

let trocadas = 0;
let mantidas = 0;
for (const [tema, destino] of Object.entries(DESTINOS)) {
  const dir = path.join(DEPLOY, 'especialidade', tema);
  const arq = path.join(dir, 'index.html');
  if (!fs.existsSync(arq)) continue;
  const atual = fs.readFileSync(arq, 'utf8');
  if (atual.includes(`url=${destino}`)) {
    mantidas++;
    continue;
  }
  const nome = destino.replace('/especialidades/', '').replace(/\/$/, '').replace(/-/g, ' ');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(arq, ponte(destino, nome), 'utf8');
  trocadas++;
}

console.log(
  `pontes legadas: ${trocadas} redirecionadas para a area especifica` +
    (mantidas ? `, ${mantidas} ja corretas` : '')
);
