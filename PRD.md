# PRD — TEC-B2 Academy
**Versão:** 2.0  
**Data:** Abril 2026  
**Empresa:** TEC-B2 (Parceiro Autorizado Vivo Empresas)  
**Responsável técnico:** Equipe de Desenvolvimento TEC-B2

---

## 1. Visão Geral do Produto

O **TEC-B2 Academy** é a plataforma interna de ensino, desenvolvimento e comunicação corporativa da TEC-B2. Ela centraliza:

- Trilhas de treinamento e cursos interativos por departamento
- Materiais e atualizações relacionados aos produtos Vivo Empresas
- Feed de atualizações corporativas
- Processo de inscrição para novas vagas internas
- Análise de desempenho acadêmico por departamento (RH/Admin)
- Administração completa de cursos, produtos, webhooks e permissões

O sistema deve operar com **máxima velocidade**, **UI/UX otimizados**, **funcionalidade 100%** e **segurança total**, preservando todos os dados históricos já existentes.

---

## 2. Público-Alvo e Tipos de Usuário

O acesso ao sistema é validado via **Clerk** (autenticação) e **Supabase** (autorização/perfil), com 4 níveis de permissão:

| Papel | Descrição | Permissões-Chave |
|---|---|---|
| **Colaborador** | Usuário padrão da empresa | Acesso a Cursos, Produtos e Feed. Apenas leitura. |
| **Gestor** | Líder de departamento | Visualiza tentativas/resultados de cursos **do seu departamento apenas** |
| **Recursos Humanos** | Equipe de RH | Visão quase completa (similar ao Admin), **sem acesso à aba Administração** |
| **Administrador** | TI / Gestão geral | Acesso irrestrito a tudo, incluindo recursos exclusivos de administração |

---

## 3. Estrutura de Navegação

### 3.1 Sidebar (Navegação Lateral Principal)

A sidebar principal deverá conter as seguintes abas, com controle de visibilidade por papel:

| Aba | Ícone | Visível para |
|---|---|---|
| **Visão Geral** | 🏠 | Todos |
| **Cursos** | 🎓 | Todos |
| **Produtos** | 📦 | Todos |
| **Vagas** | 💼 | Todos |
| **Análise** | 📊 | Gestor, RH, Admin |
| **Administração** | ⚙️ | Apenas Admin |

> **Nota:** A aba "Dashboard" atual (home) será renomeada para **"Visão Geral"**.  
> Os cursos que hoje aparecem no Dashboard serão movidos para a aba **"Cursos"**.

---

## 4. Funcionalidades por Aba

### 4.1 Aba — Visão Geral

**Feed de atualizações corporativas** que aparece logo após o login. Contém:

- Cards de notícias/atualizações publicadas pelos administradores
- Novos materiais de produtos adicionados
- Novos cursos publicados
- Ordenação cronológica reversa (mais recente no topo)
- Indicador de "não lido/novo" em cada card
- Filtro por categoria (tipo de update)
- Estatísticas rápidas do usuário: cursos concluídos, taxa acadêmica

### 4.2 Aba — Cursos

Exibição de todos os cursos disponíveis para o departamento do usuário logado, organizados por **categorias configuráveis**:

- Filtro/busca por nome de curso
- Agrupamento visual por categoria (ex: "Vivo Empresas", "Vendas", "Onboarding")
- Card de curso com: ícone, título, departamentos, status (concluído/pendente), duração estimada
- Ao iniciar um curso: entra na view de treinamento (Training.jsx)
- Regra de visibilidade: só exibe cursos cujo campo `departments` inclui o departamento do usuário ou `"Todos"`

### 4.3 Aba — Produtos

Biblioteca de materiais Vivo Empresas organizada em **pastas/categorias de produtos**:

- Cada produto é uma "pasta" cadastrada pelo Admin
- Dentro de cada pasta: materiais (PDFs, links, vídeos, imagens)
- Usuário pode visualizar e baixar materiais (sem editar)
- Atualização constante pelos administradores via aba Administração > Produtos

### 4.4 Aba — Vagas

Formulário de inscrição para novas vagas internas:

- Usuário preenche dados da candidatura
- Ao enviar, dispara webhook configurado (evento: `inscricao_recebida`)
- Confirmação visual de envio bem-sucedido
- Histórico de inscrições do usuário (somente leitura)

### 4.5 Aba — Análise *(Exclusivo: Gestor, RH, Admin)*

Análise de desempenho acadêmico:

- **Gestor:** vê apenas dados do seu departamento
- **RH / Admin:** vê todos os departamentos
- Listagem de usuários com: nome, departamento, cursos concluídos, tentativas, melhor pontuação
- Filtros por departamento, curso, período
- Exportação de dados (CSV)
- Visão de tentativas individuais com respostas detalhadas

### 4.6 Aba — Administração *(Exclusivo: Admin)*

Painel com **3 sub-abas**:

#### 4.6.1 Sub-aba: Cursos
- Course Builder completo (CRUD de cursos)
- Cada curso tem: título, ícone, categoria, descrição, módulos, status (rascunho/publicado)
- **Seletor de departamentos** (dropdown multi-seleção com checkboxes): escolhe quais departamentos podem ver o curso
- Opção: `"Todos"` para todos os departamentos
- Reordenação de módulos via drag-and-drop

#### 4.6.2 Sub-aba: Webhooks
- CRUD de webhooks cadastrados
- Cada webhook possui: nome, URL, evento associado
- **Eventos disponíveis:**
  - `curso_concluido` — Usuário finalizou um curso pela primeira vez
  - `curso_refeito` — Usuário refez um curso já concluído
  - `inscricao_recebida` — Nova inscrição de vaga submetida
  - `cadastroEmailNovoColab` — Solicitação de e-mail corporativo
- Botão de teste de disparo por webhook

#### 4.6.3 Sub-aba: Produtos
- CRUD de pastas/categorias de produtos
- Dentro de cada pasta: upload/link de materiais (PDFs, links, vídeos)
- Esses materiais ficam visíveis na aba lateral **Produtos**

---

## 5. Requisitos Não-Funcionais

### 5.1 Desempenho
- Carregamento inicial < 2s em conexões padrão (broadband)
- Lazy loading para cursos e materiais
- Cache de dados de cursos no cliente para reduzir requisições ao Supabase

### 5.2 Segurança
- Autenticação via Clerk (JWT)
- Autorização granular via `user_profiles.role` no Supabase com RLS (Row Level Security)
- Admin validado exclusivamente via papel no perfil (não hardcoded por e-mail, como hoje)
- Dados sensíveis apenas no backend (chaves de API, webhooks)
- Proteção CSRF e sanitização de inputs

### 5.3 Experiência do Usuário
- Design responsivo (desktop-first, funcional em tablets)
- Feedback visual em todas as ações (loading, sucesso, erro)
- Animações suaves (Framer Motion já integrado)
- Acessibilidade básica (labels, contrast ratios aceitáveis)

### 5.4 Preservação de Dados
- **CRÍTICO:** Os dados existentes (`courses`, `course_progress`, `user_profiles`) devem ser **100% preservados**
- Qualquer migração de schema deve ser aditiva (novas colunas, nunca deletar/renomear existentes sem plano)
- Backup antes de qualquer migração estrutural

---

## 6. Regras de Negócio Críticas

1. **Visibilidade de cursos:** Um curso só aparece para um usuário se `departments` inclui o departamento do usuário OU `"Todos"`.
2. **Conclusão de curso:** O usuário precisa de ≥ 70% de acerto para registrar conclusão em `course_progress`.
3. **Reinicialização:** O usuário pode refazer cursos já concluídos; cada tentativa é um novo registro em `course_progress`.
4. **Permissão de Gestor:** O Gestor só acessa dados de sua própria equipe, validado pelo campo `department` no perfil.
5. **RH vs Admin:** RH tem acesso semelhante ao Admin nas funções de análise, mas **não** vê a aba Administração.
6. **Webhooks:** Disparados de forma assíncrona; falha no webhook **não** bloqueia a UX do usuário.

---

## 7. Departamentos Existentes

Os seguintes departamentos já estão em uso no sistema:

- Time Hunter
- Time Farm
- Time NOQ
- Suporte ao Cliente
- Administrativo
- Backoffice
- Recursos Humanos (RH)
- Tecnologia

---

## 8. Integrações

| Sistema | Uso |
|---|---|
| **Clerk** | Autenticação, gestão de sessões, UserButton, perfil de usuário |
| **Supabase** | Banco de dados principal (cursos, progresso, perfis, webhooks, produtos) |
| **Webhooks externos** | Notificações de eventos (Make.com, n8n, etc.) |

---

## 9. Histórico de Versões

| Versão | Data | Descrição |
|---|---|---|
| 1.0 | 2025 | MVP: Cursos + Autenticação Clerk + Supabase |
| 1.5 | Mar 2026 | Course Builder, Admin Dashboard, Course Deletion |
| 2.0 | Abr 2026 | Reestruturação completa: Feed, Produtos, Vagas, Análise, Roles, Webhooks Admin |
