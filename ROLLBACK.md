# Rollback — ecooa-website

Procedimentos para reverter deploy problemático em produção.

## Quando fazer rollback

- Site fora do ar após deploy.
- Regressão grave de performance, SEO ou acessibilidade confirmada em produção.
- Erro de formulário ou analytics após deploy.
- Conteúdo incorreto publicado por acidente.

## Opção 1 — Re-run de deploy anterior (mais rápido)

1. Acesse: `https://github.com/ecooaonline/ecooa-website/actions`
2. Filtre por workflow **"Deploy to GitHub Pages"**.
3. Localize o último deploy com status verde antes do problema.
4. Clique nele → botão **"Re-run all jobs"** (canto superior direito).
5. Aguarde o build e deploy completarem (~2 min).
6. Valide: abra `https://www.somosecooa.com.br` e confirme o estado esperado.

## Opção 2 — Revert de commit (rollback rastreável)

```bash
# 1. Identifique o commit problemático
git log --oneline -10

# 2. Crie um commit de revert (não apaga histórico)
git revert <sha-do-commit-problemático> --no-edit

# 3. Push direto em main (permitido apenas em emergência)
git push origin main

# 4. O deploy.yml dispara automaticamente
```

> Prefira a Opção 1 para reversão imediata. Use a Opção 2 quando quiser registrar o revert no histórico.

## Opção 3 — Reset para commit anterior (último recurso)

```bash
# ATENÇÃO: destrói histórico após o ponto de reset
git reset --hard <sha-seguro>
git push --force origin main
```

Usar apenas em emergência extrema, com autorização explícita.

## Validação após rollback

- [ ] `https://www.somosecooa.com.br` carrega normalmente.
- [ ] Home, agendamento, contato, blog e match acessíveis.
- [ ] Formulários funcionam (teste de envio real ou smoke).
- [ ] Analytics e pixels carregam após consent.
- [ ] Sem erro 404 nas rotas principais.

## Registro de incidente

Após rollback, registre em `AI_HANDOFF.md`:

- Data e hora do incidente.
- Commit problemático (sha).
- Sintoma observado.
- Ação de rollback adotada.
- Causa raiz (quando identificada).
- Como prevenir recorrência.
