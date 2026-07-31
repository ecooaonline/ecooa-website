// Retoques visuais pós-geração, pedidos pelo dono em 2026-07-31:
//
//   1. sobre.html: arte gráfica de linha atrás do número de cada uma das nove
//      bandeiras, cada arte ligada ao tema da bandeira;
//   2. profissionais.html: marca d'água discreta da expressão (ecooa.med,
//      ecooa.esthetic, ecooa.mind, ecooa.working) no canto superior de cada
//      retrato.
//
// Uso: node scripts/retoques.mjs
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');

/* ── 1. artes das bandeiras ── */
const ARTES = [
  'M14 46 V22 L30 10 L46 22 V46 M24 46 V32 H36 V46', // 01 negocio proprio: porta que se abre
  'M24 36 a10 10 0 1 1 0.1 0 M36 36 a10 10 0 1 1 0.1 0 M30 22 a10 10 0 1 1 0.1 0', // 02 multidisciplinar: circulos entrelacados
  'M10 44 Q 30 36 50 44 M10 32 Q 30 24 50 32 M10 20 Q 30 12 50 20', // 03 sem competicao: trilhas paralelas
  'M30 48 A14 14 0 1 1 44 34 A10 10 0 1 0 34 24 A6 6 0 1 1 28 30', // 04 processo: espiral
  'M30 46 C 14 34 12 20 22 16 C 28 14 30 20 30 22 C 30 20 32 14 38 16 C 48 20 46 34 30 46 Z', // 05 gestao humanizada: coracao
  'M30 12 V48 M16 20 H44 M16 20 L10 34 H22 Z M44 20 L38 34 H50 Z', // 06 sem exploracao: balanca
  'M14 40 L26 26 L36 34 L48 16 M40 16 H48 V24', // 07 equipe: linha que sobe junta
  'M30 12 V20 M30 40 V48 M12 30 H20 M40 30 H48 M18 18 L24 24 M36 36 L42 42 M42 18 L36 24 M24 36 L18 42 M30 26 a4 4 0 1 1 0.1 0', // 08 inovacao: faisca
  'M30 8 L44 24 L30 52 L16 24 Z M16 24 H44', // 09 excelencia: diamante
];
const svgArte = (d) =>
  `<svg viewBox="0 0 60 60" aria-hidden="true" style="position:absolute; top:16px; right:0; width:62px; height:62px; opacity:.3; pointer-events:none;"><g fill="none" stroke="#C6C4BF" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></g></svg>`;

{
  const arq = path.join(DEPLOY, 'sobre.html');
  let html = fs.readFileSync(arq, 'utf8');
  if (!html.includes('data-arte-bandeira')) {
    let n = 0;
    // cada card de bandeira: div com border-top translucida contendo o numero serifado
    html = html.replace(
      /<div([^>]*style="[^"]*border-top: 1px solid rgba\(240, 238, 233, 0\.28\);[^"]*")>(\s*<span[^>]*font-size: 24px;[^>]*>)/g,
      (m, attrs, resto) => {
        if (n >= ARTES.length) return m;
        const arte = svgArte(ARTES[n]);
        n++;
        const comPosicao = attrs.includes('position:')
          ? attrs
          : attrs.replace('style="', 'style="position: relative; overflow: hidden; ');
        return `<div data-arte-bandeira${comPosicao}>${arte}${resto.replace('<span', '<span data-num-bandeira')}`;
      }
    );
    // o numero fica acima da arte
    html = html.replace(
      /<span data-num-bandeira([^>]*style=")/g,
      '<span$1position: relative; z-index: 1; '
    );
    fs.writeFileSync(arq, html, 'utf8');
    console.log(`artes das bandeiras aplicadas: ${n} de 9`);
  } else {
    console.log('artes das bandeiras já aplicadas');
  }
}

/* ── 2. marca d'água da expressão nos retratos de profissionais.html ── */
{
  global.window = {};
  await import(path.join(DEPLOY, 'dados-ecooa.js'));
  const porSlug = {};
  global.window.ECOOA.profissionais.forEach((p) => {
    porSlug[p.slug] = p.marca;
  });

  const arq = path.join(DEPLOY, 'profissionais.html');
  let html = fs.readFileSync(arq, 'utf8');
  if (!html.includes('data-marca-agua')) {
    let n = 0;
    // cada botão de retrato tem data-perfil="<slug>" e um <img> dentro
    html = html.replace(
      /(<button[^>]*data-perfil="([a-z-]+)"[^>]*>)([\s\S]*?<img)/g,
      (m, abre, slug, meio) => {
        const marca = porSlug[slug];
        if (!marca) return m;
        n++;
        const selo = `<span data-marca-agua aria-hidden="true" style="position:absolute; top:10px; right:12px; z-index:2; font-size:8.5px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.85); background:rgba(43,41,38,.34); padding:4px 8px; border-radius:999px;">${marca}</span>`;
        return abre + selo + meio;
      }
    );
    fs.writeFileSync(arq, html, 'utf8');
    console.log(`marcas d'água aplicadas: ${n} retratos`);
  } else {
    console.log("marcas d'água já aplicadas");
  }
}
