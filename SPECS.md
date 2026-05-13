# SPECS — Especificações Técnicas
## TEC-B2 Academy v2.0

**Versão:** 2.0  
**Data:** Abril 2026  
**Stack:** React + Vite + Clerk + Supabase  

---

## 1. Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| **Framework UI** | React | ^19.2.0 |
| **Build Tool** | Vite | ^7.3.1 |
| **Autenticação** | @clerk/clerk-react | ^5.61.2 |
| **Banco de Dados** | @supabase/supabase-js | ^2.98.0 |
| **Animações** | framer-motion | ^12.34.3 |
| **Ícones** | lucide-react | ^0.575.0 |
| **Drag & Drop** | @hello-pangea/dnd | ^18.0.1 |
| **CSS** | Vanilla CSS (módulos por componente) | — |
| **Localização** | @clerk/localizations (pt-BR) | ^3.37.1 |

---

## 2. Estrutura de Diretórios (Target v2.0)

```
academy_v1/
├── public/
├── src/
│   ├── assets/               # Logos, imagens estáticas
│   ├── components/           # Componentes reutilizáveis de UI
│   │   ├── Sidebar.jsx / .css
│   │   ├── CourseCard.jsx / .css
│   │   ├── Button.jsx / .css
│   │   ├── ProgressBar.jsx / .css
│   │   ├── WebhookForm.jsx / .css
│   │   ├── FeedCard.jsx / .css          [NOVO]
│   │   ├── ProductFolder.jsx / .css     [NOVO]
│   │   ├── RoleGuard.jsx               [NOVO]
│   │   ├── AccordionList.jsx / .css
│   │   ├── Carousel.jsx / .css
│   │   ├── DragDropSort.jsx / .css
│   │   ├── FlipCard.jsx / .css
│   │   ├── OpenQuestion.jsx / .css
│   │   ├── QuizCard.jsx / .css
│   │   ├── ScenarioSimulator.jsx / .css
│   │   ├── SwipeCards.jsx / .css
│   │   └── Timeline.jsx / .css
│   │
│   ├── views/                # Páginas principais
│   │   ├── Welcome.jsx / .css           # Landing / Login
│   │   ├── Onboarding.jsx / .css        # Seleção de departamento
│   │   ├── OverviewDashboard.jsx / .css [NOVO] → substitui HomeDashboard
│   │   ├── CoursesView.jsx / .css       [NOVO] → cursos por categoria
│   │   ├── ProductsView.jsx / .css      [NOVO]
│   │   ├── VagasView.jsx / .css         [NOVO]
│   │   ├── AnalyticsView.jsx / .css     [NOVO]
│   │   ├── Training.jsx / .css
│   │   ├── Result.jsx / .css
│   │   └── admin/
│   │       ├── AdminShell.jsx / .css    [NOVO] → wrapper com sub-abas
│   │       ├── AdminCourses.jsx / .css  [NOVO] → lista + builder
│   │       ├── AdminWebhooks.jsx / .css [NOVO]
│   │       ├── AdminProducts.jsx / .css [NOVO]
│   │       └── CourseBuilder.jsx / .css [EXISTENTE]
│   │
│   ├── services/
│   │   ├── supabaseClient.js
│   │   ├── courseService.js
│   │   ├── productService.js   [NOVO]
│   │   ├── feedService.js      [NOVO]
│   │   ├── webhookService.js   [NOVO]
│   │   ├── analyticsService.js [NOVO]
│   │   └── makeWebhook.js
│   │
│   ├── hooks/                  [NOVO]
│   │   ├── useUserRole.js      → hook que retorna o papel do usuário
│   │   └── useFeed.js          → hook para feed de atualizações
│   │
│   ├── data/
│   │   └── coursesData.js      # Legado, mantido para compatibilidade
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   └── config/
│       └── roles.js            [NOVO] → constantes de permissão
│
├── .env.local
├── PRD.md
├── SPECS.md
├── GEMINI.md
├── package.json
└── vite.config.js
```

---

## 3. Banco de Dados — Supabase

### 3.1 Tabelas Existentes (manter, não alterar colunas sem aprovação)

#### `courses`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | Identificador único |
| `title` | text | Nome do curso |
| `icon` | text | Emoji/ícone |
| `departments` | text[] | Lista de departamentos alvo |
| `modules` | jsonb | Estrutura de módulos e questões |
| `status` | text | `"Published"` \| `"Draft"` |
| `created_at` | timestamp | Data de criação |

**Colunas a adicionar (migração aditiva):**
- `category` (text) — categoria do curso para agrupamento na aba Cursos
- `description` (text) — descrição resumida do curso
- `estimated_duration` (int) — duração estimada em minutos

#### `course_progress`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `user_id` | text | ID do usuário Clerk |
| `course_id` | uuid | Referência ao curso |
| `percentage` | int | Percentual de acerto (0-100) |
| `score` | int | Pontuação bruta |
| `total_questions` | int | Total de questões |
| `completed_at` | timestamp | Data de conclusão |
| `answers` | jsonb | Respostas detalhadas (para análise) |

#### `user_profiles`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `user_id` | text | ID do usuário Clerk |
| `department` | text | Departamento do colaborador |
| `role` | text | `"colaborador"` \| `"gestor"` \| `"rh"` \| `"admin"` |
| `created_at` | timestamp | — |

> **Nota:** A coluna `role` pode precisar ser adicionada. Verificar no Supabase atual.

### 3.2 Tabelas Novas

#### `feed_posts`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `title` | text | Título do post |
| `body` | text | Conteúdo (markdown suportado) |
| `category` | text | Tipo: `"produto"`, `"curso"`, `"geral"`, `"vaga"` |
| `author_id` | text | ID do usuário admin que publicou |
| `is_pinned` | boolean | Fixar no topo |
| `created_at` | timestamp | — |

#### `products`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `name` | text | Nome do produto/pasta |
| `description` | text | Descrição |
| `icon` | text | Emoji/ícone |
| `order` | int | Ordem de exibição |
| `created_at` | timestamp | — |

#### `product_materials`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `product_id` | uuid | FK → products.id |
| `title` | text | Título do material |
| `type` | text | `"pdf"`, `"link"`, `"video"`, `"image"` |
| `url` | text | URL do material |
| `order` | int | Ordem interna |
| `created_at` | timestamp | — |

#### `webhooks`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `name` | text | Nome descritivo |
| `url` | text | URL do endpoint |
| `event` | text | Evento: `"curso_concluido"`, `"curso_refeito"`, `"inscricao_recebida"`, `"cadastroEmailNovoColab"` |
| `is_active` | boolean | Ativo ou desativado |
| `created_at` | timestamp | — |

#### `job_applications`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `user_id` | text | ID do usuário Clerk |
| `position` | text | Vaga pretendida |
| `message` | text | Mensagem/motivação |
| `status` | text | `"pending"`, `"viewed"`, `"approved"`, `"rejected"` |
| `submitted_at` | timestamp | — |

---

## 4. Sistema de Roles (Permissões)

### 4.1 Fonte da verdade

O papel do usuário é lido do campo `role` na tabela `user_profiles` do Supabase. Não deve ser hardcoded por e-mail no código (substituindo a verificação atual por e-mail em `Sidebar.jsx`).

### 4.2 Constantes (`src/config/roles.js`)

```js
export const ROLES = {
  COLABORADOR: 'colaborador',
  GESTOR: 'gestor',
  RH: 'rh',
  ADMIN: 'admin',
};

export const ROLE_HIERARCHY = {
  colaborador: 1,
  gestor: 2,
  rh: 3,
  admin: 4,
};

export function hasAccess(userRole, requiredRole) {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 99);
}
```

### 4.3 Componente `RoleGuard`

```jsx
// Renderiza children apenas se o usuário tiver o papel mínimo exigido
<RoleGuard minRole="gestor">
  <AnalyticsView />
</RoleGuard>
```

### 4.4 Hook `useUserRole`

```js
const { role, isAdmin, isRH, isGestor, isColaborador } = useUserRole();
```

Lê o perfil do usuário do Supabase e retorna o papel + booleans convenientes.

---

## 5. Fluxo de Autenticação e Autorização

```
1. Usuário acessa o app
2. Clerk verifica sessão → se não autenticado, renderiza <Welcome />
3. App busca user_profiles via Supabase usando user.id do Clerk
4. Se perfil não encontrado → Onboarding (seleção de departamento + criação de perfil com role padrão "colaborador")
5. Se perfil encontrado → carrega role e department
6. Sidebar renderiza abas conforme role
7. Cada view protegida por <RoleGuard> ou verificação inline
```

---

## 6. Roteamento (Estado)

O app usa **roteamento por estado** (sem React Router). O estado `currentView` no `App.jsx` controla qual view é renderizada.

### Views existentes e novas:

| `currentView` | Componente | Papel mínimo |
|---|---|---|
| `'overview'` | `<OverviewDashboard>` | Todos |
| `'courses'` | `<CoursesView>` | Todos |
| `'products'` | `<ProductsView>` | Todos |
| `'vagas'` | `<VagasView>` | Todos |
| `'training'` | `<Training>` | Todos |
| `'result'` | `<Result>` | Todos |
| `'analytics'` | `<AnalyticsView>` | gestor |
| `'admin'` | `<AdminShell>` | admin |
| `'course-builder'` | `<CourseBuilder>` | admin |

---

## 7. Design System

### 7.1 Variáveis CSS Globais (index.css / App.css)

```css
:root {
  --primary: #6C63FF;           /* Roxo principal */
  --primary-light: #8B85FF;
  --secondary: #1E1E2E;         /* Fundo escuro */
  --surface: rgba(255,255,255,0.05); /* Glassmorphism */
  --border: rgba(255,255,255,0.1);
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255,255,255,0.65);
  --accent: #00D4AA;            /* Verde sucesso */
  --danger: #FF4D6D;            /* Vermelho erro */
  --warning: #FFBE0B;           /* Amarelo aviso */
  --success-color: #4CAF50;
}
```

### 7.2 Componentes de Design

- **Glass cards:** `background: var(--surface); backdrop-filter: blur(12px); border: 1px solid var(--border);`
- **Botões:** Variantes `primary`, `secondary`, `danger` no `Button.jsx`
- **Animações:** Fade-in com `opacity + translateY` nas views principais
- **Fonte:** Sem definição explícita atual → adicionar `Inter` ou `Outfit` do Google Fonts
- **Sidebar:** Fixa à esquerda, largura 240px, colapsável (mobile)

---

## 8. Serviços

### 8.1 `courseService.js` (existente)
- `getAvailableCourses(department)` — busca cursos publicados filtrados por departamento
- `getCourseById(id)` — busca curso específico
- `saveCourse(courseData)` — cria ou atualiza curso (admin)
- `deleteCourse(id)` — exclui curso (admin)

### 8.2 `feedService.js` [NOVO]
- `getFeedPosts(limit, offset)` — lista posts do feed com paginação
- `createFeedPost(postData)` — cria post (admin)
- `deleteFeedPost(id)` — remove post (admin)

### 8.3 `productService.js` [NOVO]
- `getProducts()` — lista todas as pastas de produtos
- `getMaterialsByProduct(productId)` — lista materiais de um produto
- `saveProduct(data)` — cria ou atualiza produto (admin)
- `saveMaterial(data)` — cria ou atualiza material (admin)
- `deleteProduct(id)` — remove produto e seus materiais (admin)

### 8.4 `webhookService.js` [NOVO]
- `getWebhooks()` — lista webhooks cadastrados
- `saveWebhook(data)` — cria ou atualiza webhook
- `deleteWebhook(id)` — remove webhook
- `fireWebhook(event, payload)` — dispara todos os webhooks do evento
- `testWebhook(id)` — envia payload de teste

### 8.5 `analyticsService.js` [NOVO]
- `getProgressByDepartment(dept)` — progresso de todos os usuários de um departamento
- `getAllProgress()` — todos os dados (admin/RH)
- `getAttemptsByUser(userId)` — tentativas detalhadas de um usuário
- `exportToCSV(data)` — utilitário de exportação

---

## 9. Webhook Event System

Quando um evento ocorre no sistema, o `webhookService.fireWebhook(event, payload)` é chamado de forma assíncrona (não bloqueia UI):

```js
// Em Training.jsx após conclusão:
await webhookService.fireWebhook('curso_concluido', {
  userId: user.id,
  userName: user.fullName,
  courseId,
  courseTitle,
  score,
  percentage,
  completedAt: new Date().toISOString()
});

// Em Result.jsx se for retentativa:
await webhookService.fireWebhook('curso_refeito', { ... });

// Em VagasView.jsx após envio:
await webhookService.fireWebhook('inscricao_recebida', {
  userId: user.id,
  position,
  message,
  submittedAt: new Date().toISOString()
});
```

---

## 10. Supabase Row Level Security (RLS)

### Políticas recomendadas:

```sql
-- user_profiles: usuário lê/edita apenas o próprio perfil
-- Admins podem ler todos
CREATE POLICY "users_own_profile" ON user_profiles
  FOR ALL USING (auth.uid()::text = user_id);

-- courses: todos os autenticados podem ler publicados
CREATE POLICY "read_published_courses" ON courses
  FOR SELECT USING (status = 'Published');

-- course_progress: usuário vê apenas seu próprio progresso
CREATE POLICY "own_progress" ON course_progress
  FOR ALL USING (auth.uid()::text = user_id);

-- feed_posts: todos leem, apenas role=admin escreve
-- products / product_materials: todos leem, apenas admin escreve
-- webhooks: apenas admin lê e escreve
-- job_applications: usuário cria/lê as suas; rh/admin lê todas
```

> **Nota:** O Supabase Anon Key usado no frontend limita o acesso às políticas RLS. Operações administrativas sensíveis devem usar Service Role Key **apenas no backend** (não expor no frontend).

---

## 11. Variáveis de Ambiente

```env
# .env.local
VITE_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
VITE_SUPABASE_URL=https://rdyjekrrpzbphsxjrvbn.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

> ⚠️ A `SUPABASE_SERVICE_ROLE_KEY` não deve nunca ser exposta no frontend.

---

## 12. Plano de Migração de Dados

### Princípio: Migração aditiva, nunca destrutiva

1. **Adicionar colunas** novas às tabelas existentes com valor padrão (ex: `role = 'colaborador'`)
2. **Criar tabelas novas** sem remover as existentes
3. **Backup obrigatório** do Supabase antes de qualquer DDL
4. **Validar** que `courses`, `course_progress` e `user_profiles` estão intactos pós-migração

### Scripts de migração planejados:
```sql
-- 1. Adicionar role ao user_profiles (se não existir)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'colaborador';

-- 2. Adicionar category e description aos courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS category text DEFAULT 'Geral';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS estimated_duration int;

-- 3. Criar tabelas novas
CREATE TABLE IF NOT EXISTS feed_posts (...);
CREATE TABLE IF NOT EXISTS products (...);
CREATE TABLE IF NOT EXISTS product_materials (...);
CREATE TABLE IF NOT EXISTS webhooks (...);
CREATE TABLE IF NOT EXISTS job_applications (...);
```

---

## 13. Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Verificar lints
npm run lint
```

---

## 14. Convenções de Código

- **Componentes:** PascalCase, cada um tem seu `.jsx` + `.css` próprio
- **Serviços:** camelCase, exportados como objeto ou named exports
- **Hooks:** `use` prefix, camelCase
- **Constantes globais:** UPPER_SNAKE_CASE em `src/config/`
- **Comentários:** em português, alinhados com a equipe
- **Nenhum dado hardcoded de e-mail** para permissões (substituir por role no DB)
