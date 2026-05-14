import { useState, useMemo } from 'react';
import './MemberArea.css';

/**
 * MemberArea — Área de membros estilo Hotmart
 * Hero banner roxo + grid de módulos baseados em embeds do Canva.
 * Não depende mais de cursos do banco — os materiais são gerenciados
 * via MODULES_DATA (embeds do Canva) no MaterialViewer.
 */

// Módulos disponíveis — espelha a estrutura do MaterialViewer
const MODULES = [
    {
        id: 'mod-welcome',
        title: 'Bem-vindo(a) a TEC-B2!',
        icon: '🏢',
        materialsCount: 1,
        progress: 0,
        firstMaterialId: 'mat-rh'
    },
    {
        id: 'mod-sistemas',
        title: 'Sistemas e Negociações',
        icon: '💻',
        materialsCount: 3,
        progress: 0,
        firstMaterialId: 'mat-sistemas'
    },
    {
        id: 'mod-rotina',
        title: 'Rotina e Funil de Vendas',
        icon: '📈',
        materialsCount: 2,
        progress: 0,
        firstMaterialId: 'mat-basico'
    },
    {
        id: 'mod-produtos',
        title: 'Produtos',
        icon: '📦',
        materialsCount: 3,
        progress: 0,
        firstMaterialId: 'mat-ftth'
    }
];

const MemberArea = ({ user, progress, onViewMaterial, completedModules, role }) => {
    const [activeTab, setActiveTab] = useState('conteudos');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [heroExpanded, setHeroExpanded] = useState(false);

    // Módulos filtrados pela busca
    const filteredModules = useMemo(() => {
        if (!searchQuery.trim()) return MODULES;
        const q = searchQuery.toLowerCase();
        return MODULES.filter(m =>
            m.title.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    // Lógica de desbloqueio de módulo
    const isModuleUnlocked = (modId) => {
        if (role === 'admin') return true;
        const modIndex = MODULES.findIndex(m => m.id === modId);
        if (modIndex <= 0) return true; // Primeiro módulo sempre liberado
        const previousMod = MODULES[modIndex - 1];
        return completedModules?.includes(previousMod.id);
    };

    // Contagem total de materiais e progresso geral
    const totalMaterials = MODULES.reduce((sum, m) => sum + m.materialsCount, 0);
    const overallProgress = MODULES.length > 0
        ? Math.round(MODULES.reduce((sum, m) => sum + m.progress, 0) / MODULES.length)
        : 0;

    // Descrição do produto para o hero
    const productDescription = "Criamos este ambiente exclusivo para reunir todo o nosso acervo de treinamentos, manuais operacionais e processos estratégicos em um só lugar. Aqui, cada colaborador da TEC-B2 pode aprender no seu ritmo e evoluir profissionalmente com conteúdos curados pela nossa equipe.";

    return (
        <div className="member-area" id="member-area">
            {/* ====== HERO BANNER ====== */}
            <section className="member-hero" id="member-hero">
                <div className="member-hero-content">
                    <div className="member-hero-text">
                        <h1 className="member-hero-title">Chegou a hora de superar nossos limites!</h1>
                        <p className={`member-hero-description ${heroExpanded ? 'expanded' : ''}`}>
                            {productDescription}
                        </p>
                        <button
                            className="member-hero-toggle"
                            onClick={() => setHeroExpanded(!heroExpanded)}
                        >
                            {heroExpanded ? 'Mostrar menos' : 'Mostrar mais'}
                        </button>

                        <div className="member-hero-progress">
                            <span className="member-hero-count">
                                {totalMaterials} conteúdo{totalMaterials !== 1 ? 's' : ''} — {overallProgress}%
                            </span>
                            <div className="member-hero-progress-bar">
                                <div
                                    className="member-hero-progress-fill"
                                    style={{ width: `${overallProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        <button
                            className="member-hero-cta"
                            onClick={() => onViewMaterial && onViewMaterial(MODULES[0].firstMaterialId)}
                            id="hero-cta-btn"
                        >
                            Assistir
                        </button>
                    </div>

                    <div className="member-hero-brand">
                        <div className="member-hero-logo">
                            <span className="hero-logo-text">Tec-B2</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== TABS ====== */}
            <section className="member-tabs-section">
                <div className="member-tabs" id="member-tabs">
                    <button
                        className={`member-tab ${activeTab === 'conteudos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('conteudos')}
                        id="tab-conteudos"
                    >
                        Conteúdos
                    </button>
                    <button
                        className={`member-tab ${activeTab === 'sobre' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sobre')}
                        id="tab-sobre"
                    >
                        Sobre
                    </button>
                </div>
            </section>

            {/* ====== CONTEÚDO DA TAB ====== */}
            {activeTab === 'conteudos' && (
                <section className="member-content" id="member-content">
                    <div className="member-content-header">
                        <h2 className="member-content-title">Todos os conteúdos</h2>
                        <div className="member-content-controls">
                            <div className="member-search-box">
                                <input
                                    type="text"
                                    placeholder="Buscar conteúdo"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="member-search-input"
                                    id="content-search-input"
                                />
                                <svg className="member-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </div>

                            <div className="member-view-toggle">
                                <button
                                    className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                    aria-label="Visualização em lista"
                                    id="view-list-btn"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <line x1="3" y1="12" x2="21" y2="12" />
                                        <line x1="3" y1="18" x2="21" y2="18" />
                                    </svg>
                                </button>
                                <button
                                    className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    aria-label="Visualização em grade"
                                    id="view-grid-btn"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7" />
                                        <rect x="14" y="3" width="7" height="7" />
                                        <rect x="3" y="14" width="7" height="7" />
                                        <rect x="14" y="14" width="7" height="7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Grid / Lista de módulos */}
                    {filteredModules.length === 0 ? (
                        <div className="member-empty-state">
                            <p>Nenhum conteúdo encontrado.</p>
                        </div>
                    ) : (
                        <div className={`member-courses-${viewMode}`} id="courses-container">
                            {filteredModules.map(mod => {
                                const unlocked = isModuleUnlocked(mod.id);
                                return (
                                <article
                                    key={mod.id}
                                    className={`member-course-card ${!unlocked ? 'locked' : ''}`}
                                    onClick={() => {
                                        if (unlocked && onViewMaterial) {
                                            onViewMaterial(mod.firstMaterialId);
                                        }
                                    }}
                                    id={`module-card-${mod.id}`}
                                >
                                    <div className={`course-card-thumbnail ${!unlocked ? 'locked-thumb' : ''}`}>
                                        <div className="course-card-thumb-inner">
                                            <span className="course-card-emoji">{mod.icon}</span>
                                        </div>
                                        {unlocked && <span className="course-card-badge">Grátis</span>}

                                        {/* Overlay de hover ou bloqueado */}
                                        {unlocked ? (
                                            <div className="course-card-overlay">
                                                <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                                                    <polygon points="5 3 19 12 5 21 5 3" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="course-card-locked-overlay">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                                <span>Módulo Bloqueado</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="course-card-info">
                                        <div className="course-card-progress-row">
                                            <div className="course-card-progress-bar">
                                                <div
                                                    className={`course-card-progress-fill ${mod.progress >= 70 ? 'completed' : ''}`}
                                                    style={{ width: `${mod.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className={`course-card-percentage ${mod.progress >= 70 ? 'completed' : ''}`}>
                                                {mod.progress}%
                                            </span>
                                        </div>
                                        <h3 className="course-card-title">{mod.title}</h3>
                                    </div>
                                </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {/* ====== TAB SOBRE ====== */}
            {activeTab === 'sobre' && (
                <section className="member-about" id="member-about">
                    <div className="member-about-content">
                        <h2>Sobre o EduTec</h2>
                        <p>
                            O <strong>EduTec – Treinamentos</strong> é a plataforma oficial de capacitação
                            da <strong>TEC-B2</strong>, Parceira Autorizada Vivo Empresas.
                        </p>
                        <p>
                            Nossa missão é oferecer treinamentos dinâmicos e acessíveis que aceleram o
                            desenvolvimento profissional de cada colaborador. Aqui você encontra cursos
                            sobre produtos, processos internos, técnicas de vendas e muito mais.
                        </p>

                        <div className="about-highlights">
                            <div className="about-highlight-card">
                                <span className="about-highlight-icon">📚</span>
                                <h4>{totalMaterials} Conteúdos</h4>
                                <p>Materiais disponíveis para você</p>
                            </div>
                            <div className="about-highlight-card">
                                <span className="about-highlight-icon">🎯</span>
                                <h4>Certificação</h4>
                                <p>Ganhe selos ao concluir os cursos</p>
                            </div>
                            <div className="about-highlight-card">
                                <span className="about-highlight-icon">⚡</span>
                                <h4>Interativo</h4>
                                <p>Apresentações, vídeos e materiais práticos</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default MemberArea;
