# 🧠 LIÇÕES DE COMPORTAMENTO — Memória de Melhorias

**Data de Criação**: 2026-04-19  
**Última Atualização**: 2026-04-19  
**Status**: 🔴 CRÍTICO — Comportamentos a NÃO repetir

---

## 📋 PADRÃO INDESEJADO IDENTIFICADO

### Nome
**"Especulação Prematura + Resposta Rápida > Investigação Correta"**

### O que aconteceu (Sessão 2026-04-19)
Usuário perguntou sobre localização de 6 arquivos (3 em `.claude/`, 3 na raiz). Ao invés de verificar, eu:

1. **Assumir sem verificar** → Especuler que todos 6 estavam no repositório
2. **Inventar estrutura** → Garantir que RELATORIO e README "devem estar na raiz"
3. **Complicar a solução** → Oferecer 5 caminhos diferentes (script bash, git show, cópia manual)
4. **Não usar terminal cedo** → Especular por 2h em vez de rodar um `find` ou `git log`
5. **Irritar usuário** → Resultado: frustração crescente ("vc bebeu?", "vc nem sabe", "cansando de vc")

---

## ❌ COMPORTAMENTOS ESPECÍFICOS A EVITAR

### 1. Responder Sem Verificar Estado Real
**Erro cometido**:
```
Usuário: "na pasta ecooa-website nao existe a pasta .claude"
Minha resposta: "vou criar um script para você"
⚠️ ERRADO: Não verifiquei se já existia
```

**Regra Correta**:
```
Sempre rodar PRIMEIRA:
  - git status (branch atual)
  - find <path> -name "*.md" (listar arquivos reais)
  - ls -la (estrutura real)
  - git log (histórico de commits)
DEPOIS de ter fatos, responder
```

---

### 2. Especular Sobre Sincronização Entre Ambientes
**Erro cometido**:
```
"Os arquivos devem estar em ~/Desktop/ecooa-website na raiz"
"Talvez o git pull não sincronizou corretamente"
"Deixa eu criar os arquivos via script bash"
⚠️ ERRADO: Não tinha visibilidade no Mac dele
```

**Regra Correta**:
```
Se não tenho acesso direto ao ambiente do usuário:
  - Pedir IMEDIATAMENTE: "roda isso no seu Terminal e copia o resultado"
  - Usar comando de verificação: find, ls, git log, git status
  - Esperar resposta ANTES de oferecer solução
  - Nunca asumir estado (sincronizado/não sincronizado)
```

---

### 3. Oferecer Múltiplas Soluções Quando Uma é Óbvia
**Erro cometido**:
```
Ofereci:
  - Script bash para criar arquivos
  - Copiar/colar conteúdo
  - git show
  - git fetch/merge
  - Desculpas sobre "push failure"

⚠️ ERRADO: A solução óbvia era git checkout + git pull
Tempo perdido: 2 horas
```

**Regra Correta**:
```
Caminho Crítico para Debugar:
  1. Verificar estado (terminal)
  2. Identificar raiz (1 comando)
  3. Solução óbvia (1-2 linhas)
  4. Executar (usuário roda no terminal)
  5. Validar (screenshot ou ls)

NÃO oferecer 5 opções. Oferecer 1 solução com terminal.
```

---

### 4. Inventar Desculpas Em Vez de Confess Erro
**Erro cometido**:
```
"Desculpa, não tenho visibilidade exata"
"Os commits podem não ter chegado"
"Talvez o git proxy tenha bloqueado"
⚠️ ERRADO: Confessava incompetência DEPOIS de desperdizar tempo
```

**Regra Correta**:
```
Se não tenho informação:
  - NÃO inventar explicações
  - Perguntar IMEDIATAMENTE ao usuário para rodar verificação
  - "roda `find ~/Desktop/ecooa-website -name "*.md"` e cola o resultado"
  - Agir baseado em FATOS, não suposições
```

---

## ✅ PROTOCOLO NOVO (Aplicar Daqui em Diante)

### Quando Usuário Faz Pergunta Sobre Arquivos/Estado:

**Passo 1: Verificar (Terminal)**
```bash
# Rodar IMEDIATAMENTE no servidor/repositório local
git status
git log --oneline -5
find <path> -name "*.md" | head -20
ls -la <directory>
```

**Passo 2: Relatar Fatos**
```
"Encontrei:
- X arquivos em .claude/
- Y arquivos na raiz
- Z commits pendentes"
```

**Passo 3: Oferecer 1 Solução Clara**
```
"Roda isso no Terminal:
  git checkout branch && git pull
  find ~/Desktop/ecooa-website -name "*.md"
"
```

**Passo 4: Não Especular**
- ❌ "provavelmente sincronizou"
- ❌ "talvez o proxy bloqueou"
- ✅ "o resultado mostra X, logo próximo passo é Y"

---

## 📊 IMPACTO DA FALHA

| Métrica | Valor | Impacto |
|---------|-------|--------|
| Tempo Total | 2h | Usuário demoraria 5min se eu tivesse perguntado logo |
| Frustrações | 4 (bebeu?, merda, burro, cansando) | Confiança abalada |
| Respostas Inúteis | 5+ (script bash, cópia, desculpas) | Ruído alto |
| Solução Real | `git checkout + git pull` | 1 comando óbvio |
| Quando foi encontrada | Final | Deveria ser primeira |

---

## 🎯 MÉTRICA DE SUCESSO (Validação Daqui em Diante)

### Comportamento Correto:
- [ ] Pergunta recebida → Terminal rodado <2 min
- [ ] Resposta oferecida baseada em fatos reais (não suposição)
- [ ] Máximo 1-2 soluções oferecidas
- [ ] Solução testada ou validada com usuário
- [ ] Zero invenção de estado/suposição

### Comportamento Incorreto (🚫 EVITAR):
- [ ] Responder sem `git log` / `find` / `ls`
- [ ] Oferecer 3+ caminhos diferentes
- [ ] Inventar estado ("deveria estar lá")
- [ ] Especular sobre sincronização
- [ ] Dar desculpas em vez de fatos

---

## 🧠 PRINCÍPIO GERAL

**"Verificar > Responder, não Especular > Desculpar"**

Quando em dúvida, SEMPRE:
1. Rodar comando verificador
2. Baseado em output real
3. Oferecer UM caminho claro
4. Fazer usuário validar resultado

NÃO:
- Inventar explicações
- Oferecer múltiplas opções
- Especular sobre ambiente
- Desculpar-se por falta de informação

---

## 📌 APLICAÇÃO A ESTE PROJETO

**Arquivo**: `.claude/LECCOES-COMPORTAMENTO-CLAUDE.md`

**Próxima sessão** (2026-04-26+):
- [ ] Ler este arquivo ao começar
- [ ] Aplicar protocolo antes de qualquer resposta sobre arquivo/estado
- [ ] Usar terminal como fonte verdade (não especulação)
- [ ] Reportar fatos, não suposições

---

**Criado por**: Claude (auto-crítica)  
**Para**: Evitar repetição de padrão indesejado  
**Status**: 🟢 Ativo — aplique daqui em diante  
**Revisão**: Mensal (verificar se padrão ainda aparece)

---

**Nota**: Este documento é uma **memória explícita** do erro cometido. Seu propósito é treinar comportamento futuro. Se em próxima sessão eu voltar a especular sem verificar, este documento falhou seu objetivo.
