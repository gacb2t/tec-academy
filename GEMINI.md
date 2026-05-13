# GEMINI.md — Contexto do Projeto para Assistentes de IA
## TEC-B2 Academy

> Este arquivo fornece contexto essencial para qualquer assistente de IA (Gemini, Antigravity, Copilot etc.) 
> trabalhar com este repositório de forma eficiente, correta e segura.

---

## O que é este projeto?

**TEC-B2 Academy** é a plataforma interna de ensino, desenvolvimento corporativo e comunicação da **TEC-B2**, empresa Parceira Autorizada **Vivo Empresas**. É construída em **React + Vite**, com autenticação via **Clerk** e banco de dados **Supabase**.

**Versão atual:** 2.0 (em desenvolvimento ativo)  
**Localização:** `s:\TEC-B2\TEC-B2 Academy\Sistema\Ambiente de Desenvolvimento\academy_v1\`

---

## Documentação oficial do projeto

Antes de qualquer tarefa, leia os documentos abaixo na ordem:

1. **`PRD.md`** — Requisitos de produto, funcionalidades, regras de negócio, estrutura de navegação
2. **`SPECS.md`** — Especificações técnicas: stack, banco de dados, serviços, roles, estrutura de arquivos

---

## Stack e Principais Dependências

| Tecnologia | Versão | Uso |
|---|---|---|
| React | ^19.2 | Framework UI |
| Vite | ^7.3 | Build tool |
| @clerk/clerk-react | ^5.61.2 | Autenticação e sessão |
| @supabase/supabase-js | ^2.98 | Banco de dados |
| framer-motion | ^12.34 | Animações |
| lucide-react | ^0.575 | Ícones |
| @hello-pangea/dnd | ^18 | Drag and Drop |

---

## Estrutura de Permissões (CRÍTICO)

O sistema tem **4 papéis**: `colaborador`, `gestor`, `rh`, `admin`.

- O papel é armazenado na coluna `role` da tabela `user_profiles` no Supabase
- **Nunca use e-mail hardcoded para verificar permissões** — leia sempre o `role` do banco
- Use o hook `useUserRole()` (a ser implementado em `src/hooks/useUserRole.js`) ou leia de `user_profiles`
- O papel atual ainda está hardcoded por e-mail em `Sidebar.jsx` (linha 128) — isso é legado e deve ser substituído

---

## Banco de Dados — Supabase

### Regra de ouro: NUNCA destrua dados existentes

- As tabelas `courses`, `course_progress` e `user_profiles` **já têm dados reais de usuários**
- Qualquer migração deve ser **aditiva** (ADD COLUMN IF NOT EXISTS, CREATE TABLE IF NOT EXISTS)
- Jamais faça DROP TABLE, DROP COLUMN ou RENAME em colunas existentes sem aprovação explícita
- O Supabase URL: `https://rdyjekrrpzbphsxjrvbn.supabase.co`

### Tabelas existentes
- `courses` — cursos com módulos em JSONB, campo `departments` (text[]), `status` ("Published" | "Draft")
- `course_progress` — progresso por usuário, campo `percentage` (int 0-100), `answers` (jsonb)
- `user_profiles` — perfil com `department` (text) e `role` (text, pode precisar ser adicionado)

### Tabelas planejadas para v2.0
- `feed_posts` — posts do feed de novidades
- `products` — pastas de produtos Vivo Empresas
- `product_materials` — materiais dentro de cada produto
- `webhooks` — configuração de webhooks de eventos
- `job_applications` — inscrições para vagas internas

---

## Arquitetura de Navegação

O app usa **roteamento por estado** (sem React Router). O estado `currentView` em `App.jsx` controla a view ativa.

### Views atuais (v1.x → em migração para v2.0):
- `'home'` → `HomeDashboard.jsx` (será substituído por `OverviewDashboard.jsx`)
- `'training'` → `Training.jsx`
- `'result'` → `Result.jsx`
- `'admin'` → `AdminDashboard.jsx` (será substituído por `AdminShell.jsx` com sub-abas)
- `'course-builder'` → `CourseBuilder.jsx`

### Views novas para v2.0:
- `'overview'` — Feed + stats (substitui 'home')
- `'courses'` — Cursos por categoria
- `'products'` — Materiais Vivo Empresas
- `'vagas'` — Inscrição para vagas
- `'analytics'` — Análise de desempenho (gestor, rh, admin)
- `'admin'` — AdminShell com subabas: Cursos / Webhooks / Produtos

---

## Convenções de Código

- **Componentes:** PascalCase. Cada componente tem seu próprio `.jsx` + `.css` no mesmo diretório
- **Serviços:** Exportados de `src/services/`. Objetos com métodos async que chamam Supabase
- **Estilos:** Vanilla CSS por componente. Variáveis CSS globais em `index.css`/`App.css`
- **Idioma:** Código em inglês, comentários e UI em português (pt-BR)
- **Localização Clerk:** Já configurado com pt-BR via `@clerk/localizations`
- **Canvas Confetti:** Usado na tela de resultado para celebração

---

## Padrões de Design (UI/UX)

- Design dark com glassmorphism: `background: rgba(255,255,255,0.05); backdrop-filter: blur(12px)`
- Variável `--primary: #6C63FF` (roxo), `--accent: #00D4AA` (verde), `--danger: #FF4D6D`
- Animações de entrada com `fade-in` (translação Y + opacidade)
- Feedback visual obrigatório em todas as ações: loading states, mensagens de sucesso/erro
- Sidebar fixa à esquerda (240px), conteúdo principal à direita

---

## Fluxo de Autenticação

```
Não autenticado → Welcome.jsx (landing + login Clerk)
     ↓
Autenticado, sem perfil no Supabase → Onboarding.jsx (selecionar departamento)
     ↓
Autenticado, com perfil → App layout com Sidebar + View conforme currentView
```

O `App.jsx` é o orquestrador principal: gerencia estado de auth, dados do usuário e navegação.

---

## Webhooks

- Webhooks são configurados no painel Admin > Webhooks
- Cada webhook tem: nome, URL, evento associado, status ativo/inativo
- **Eventos do sistema:**
  - `curso_concluido` — Disparado quando usuário finaliza um curso pela primeira vez
  - `curso_refeito` — Disparado quando usuário refaz um curso já concluído
  - `inscricao_recebida` — Disparado ao enviar candidatura para uma vaga
  - `cadastroEmailNovoColab` — Solicitação de e-mail corporativo para novo colaborador
- Falha no webhook não deve bloquear a UI (fire-and-forget assíncrono)

---

## Departamentos (valores válidos no banco)

```
"Time Hunter" | "Time Farm" | "Time NOQ" | "Suporte ao Cliente" |
"Administrativo" | "Backoffice" | "Recursos Humanos" | "Tecnologia" | "Todos"
```

O valor `"Todos"` em `courses.departments` significa que o curso é visível para todos os departamentos.

---

## O que NÃO fazer

- ❌ Não remover ou renomear colunas das tabelas existentes
- ❌ Não hardcodar e-mails para verificação de permissão (usar `role` do banco)
- ❌ Não expor `SUPABASE_SERVICE_ROLE_KEY` no frontend
- ❌ Não instalar novas dependências pesadas sem aprovação (o bundle já está bem configurado)
- ❌ Não usar TailwindCSS (o projeto usa Vanilla CSS com variáveis)
- ❌ Não usar React Router (o roteamento é via estado em App.jsx)
- ❌ Não fazer fetch direto ao Supabase fora dos services (sempre usar o `supabaseClient.js` importado)

---

## O que priorizar

- ✅ Preservação total dos dados existentes
- ✅ Consistência visual com o design system existente (dark + glassmorphism + roxo)
- ✅ Performance: evitar re-renders desnecessários, usar useCallback/useMemo quando relevante
- ✅ Segurança: validação de roles antes de renderizar conteúdo sensível
- ✅ UX fluida: feedback visual, loading states, animações suaves
- ✅ Código comentado em português para facilitar manutenção da equipe

---

## Contato e Contexto

**Empresa:** TEC-B2 — Parceiro Autorizado Vivo Empresas  
**Projeto:** Plataforma interna de LMS + comunicação corporativa  
**Ambiente:** Windows, VS Code, Powershell  
**Deploy:** Ainda não definido (projeto em desenvolvimento ativo local)
