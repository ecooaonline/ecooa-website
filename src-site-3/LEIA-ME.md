# Pacote de publicação · site ecooa 3.0

Pasta pronta para subir em qualquer hospedagem estática (Cloudflare Pages, Netlify,
Vercel, GitHub Pages). Nada aqui precisa de build.

## Conteúdo

- 11 páginas HTML com rota limpa
- `Sobrancelha.dc.html` e `Rodape.dc.html`: navegação e rodapé compartilhados, carregados
  pelas páginas. Mantenha os nomes: as páginas os referenciam por nome.
- `support.js`: runtime das páginas. Obrigatório.
- `dados-ecooa.js`: fonte única de profissionais, especialidades e artigos.
- `assets/`: apenas os 52 arquivos em uso.
- `robots.txt` e `sitemap.xml`

## Rotas

| Arquivo                         | URL final                   |
| ------------------------------- | --------------------------- |
| index.html                      | /                           |
| sobre.html                      | /sobre                      |
| especialidades.html             | /especialidades             |
| profissionais.html              | /profissionais              |
| qual-profissional-procurar.html | /qual-profissional-procurar |
| blog.html                       | /blog                       |
| localizacao.html                | /localizacao                |
| mentorias.html                  | /mentorias                  |
| sublocacao.html                 | /sublocacao                 |
| politicas.html                  | /politicas · noindex        |
| 404.html                        | página de erro              |

## Configuração na hospedagem

1. Ativar URL limpa (a maioria das plataformas serve `/sobre` a partir de `sobre.html`
   automaticamente; em algumas é uma opção chamada "clean urls" ou "pretty urls").
2. Apontar a página de erro 404 para `404.html`.
3. Definir o domínio canônico e redirecionar a variante (apex ou www) para ela.
4. Trocar `https://www.somosecooa.com.br/` nos canonicals, no Open Graph e no sitemap
   se o domínio final for outro.

## Antes de considerar publicado

- Redirecionamento 301 de toda rota do site anterior que mudou de endereço. Os artigos
  do blog devem permanecer em `/blog/<slug>`.
- Doze registros profissionais aguardam confirmação no conselho. Nenhum deles está em
  dado estruturado, e na tela aparecem com a ressalva.
- A página de políticas é rascunho e precisa de revisão jurídica.
- Não há analytics nem dado estruturado JSON-LD. São as próximas etapas.
