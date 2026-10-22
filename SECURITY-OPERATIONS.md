# Operação e recuperação de segurança

Auditoria de 22/10/2026. Esta branch não comprova publicação.

## Publicação

Exigir PR e revisão humana para alterações em `.github/`, headers, integrações,
formulários e dependências. Tornar `Dependency security` e os gates existentes
obrigatórios nas regras da branch. Workflow sozinho não impede deploy por push.
Confirmar no provedor que somente a branch protegida publica em produção e que o
build aprovado é o mesmo artefato publicado. Sem acesso ao provedor isso fica pendente.
Não ligar auto-merge neste PR de segurança.

## CSP

O build gera hashes dos scripts inline no `dist/_headers` em Report-Only.
Isso observa incompatibilidades no console, sem bloquear. Não existe coletor remoto.
Cloudflare Workers/Pages lê `_headers` para assets; Vercel não lê esse formato.
Confirmar o header real no preview e na borda antes de endurecer a política efetiva.
Manter estilos inline por enquanto. Testar menu, formulário, mapas e analytics
antes/depois do consentimento, em desktop e celular. Nenhum teste deve enviar
lead real sem autorização específica.

## Monitoramento

Executar `node scripts/security-monitor.mjs` ou o workflow manual
`Production Security Monitor`. Ele verifica HTTP, HTTPS final, HSTS e CSP.
403/challenge é falha de observabilidade, não prova de indisponibilidade.
O workflow está preparado para execução diária às 09:17 UTC após merge na branch
padrão. Antes disso não há monitor ativo. Ele detecta divergência de CSP/HSTS em
relação ao arquivo versionado. Não envia webhook nem campos de formulários.
Definir responsável e preferências de alertas do GitHub; testar restauração trimestral.
GitHub notifica falhas de workflow conforme as preferências do assinante.

## Incidente e restauração

1. Registrar horário UTC, URL, deploy e commit afetado sem copiar dados de leads.
2. Preservar logs privados do provedor e verificar escopo; não apagar evidência.
3. Suspender novas publicações e decidir rollback com o responsável.
4. No provedor, restaurar o último deploy validado; conferir também os headers
   da borda, que podem ser independentes do Git. Não alterar DNS para esse passo.
5. Verificar HTTPS, rotas, navegação e formulários com dados sintéticos em preview.
6. Só declarar recuperação após confirmar a versão em produção e o destino dos dados.
7. Revisar credenciais afetadas com o administrador, usando MFA e menor privilégio.

Git/deploys permitem recuperar conteúdo estático; não são backup de dados dinâmicos.
Inventariar com o dono planilhas, email, ESP/CRM e logs; definir retenção, RPO/RTO,
backup criptografado, acesso e um ensaio de restauração sem PII em log público.
Não foram criados backups de dados pessoais nesta auditoria.
