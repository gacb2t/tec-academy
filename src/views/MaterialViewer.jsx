import { useState, useEffect, useMemo, useCallback } from 'react';
import { courseService } from '../services/courseService';
import { supabase } from '../services/supabaseClient';
import { useUser } from '@clerk/clerk-react';
import './MaterialViewer.css';

/**
 * MaterialViewer — Tela de visualização de material estilo Hotmart
 * Layout: conteúdo principal (embed + comentários) + sidebar de navegação
 * Materiais são exibidos via embed do Canva
 */

// Dados fixos dos materiais — cada módulo contém materiais com embeds do Canva
const MODULES_DATA = [
    {
        id: 'mod-welcome',
        title: 'Bem-vindo(a) a TEC-B2',
        materials: [
            {
                id: 'mat-rh',
                title: '01 - Recursos Humanos',
                embedSrc: 'https://www.canva.com/design/DAGaarY_2jE/TyEellWU6VpH8NSSWXSnGQ/view?embed',
                type: 'presentation',
            },
        ],
    },
    {
        id: 'mod-sistemas',
        title: 'Sistemas e Negociações',
        materials: [
            {
                id: 'mat-sistemas',
                title: '01 - Sistemas, Ferramentas e Diário de Bordo',
                embedSrc: 'https://www.canva.com/design/DAHJkJ0W-wQ/PraOlv0XggvUIbRP5R2HBA/view?embed',
                type: 'presentation',
            },
            {
                id: 'mat-carteira',
                title: '02 - Carteira de Clientes e CRM',
                embedSrc: 'https://www.canva.com/design/DAHJmIIH8yw/Nx24AbZtVDpUXagwfE-Rfg/view?embed',
                type: 'presentation',
            },
            {
                id: 'mat-funis',
                title: '03 - Funis de Venda e Contratos',
                embedSrc: 'https://www.canva.com/design/DAHJmDa3H-8/aDQFHYmEkjFJOhacJQpLSw/view?embed',
                type: 'presentation',
            },
        ],
    },
    {
        id: 'mod-rotina',
        title: 'Rotina e Funil de Vendas',
        materials: [
            {
                id: 'mat-basico',
                title: '01 - Módulo Básico',
                embedSrc: 'https://www.canva.com/design/DAHJmLwPUpc/EF8GdtkHaDG3ldethhVNZQ/view?embed',
                type: 'presentation',
            },
            {
                id: 'mat-avancado',
                title: '02 - Módulo Avançado',
                embedSrc: 'https://www.canva.com/design/DAHJmEbjk2I/3JuztyVS--8ilj0oUQ6Cvg/view?embed',
                type: 'presentation',
            },
        ],
    },
    {
        id: 'mod-produtos',
        title: 'Produtos',
        materials: [
            {
                id: 'mat-ftth',
                title: '01 - FTTH (Banda Larga)',
                embedSrc: 'https://www.canva.com/design/DAGaa9yUmzo/yiYUdpPKq1qiW8yP3Zx5Qw/view?embed',
                type: 'presentation',
            },
            {
                id: 'mat-moveis',
                title: '02 - Móveis',
                embedSrc: 'https://www.canva.com/design/DAGaa4a3TYQ/M9nxuRzdJvC6Mj7LemzVtw/view?embed',
                type: 'presentation',
            },
            {
                id: 'mat-vvn',
                title: '03 - Vivo Voz Negócio (VVN)',
                embedSrc: 'https://www.canva.com/design/DAGaaz4K1NY/9KvtsWK2E48B3MjR1UHRyw/view?embed',
                type: 'presentation',
            },
        ],
    },
];

const MaterialViewer = ({ 
    courseId, 
    materialId: initialMaterialId, 
    onBack, 
    completedMaterials = [], 
    onComplete, 
    completedModules = [], 
    role = 'colaborador' 
}) => {
    const { user: clerkUser } = useUser();

    // Estado do material ativo
    const [activeModuleId, setActiveModuleId] = useState(MODULES_DATA[0]?.id || '');
    const [activeMaterialId, setActiveMaterialId] = useState(
        initialMaterialId || MODULES_DATA[0]?.materials[0]?.id || ''
    );

    // Sidebar
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarSearch, setSidebarSearch] = useState('');
    const [expandedModules, setExpandedModules] = useState(() => {
        const initial = {};
        MODULES_DATA.forEach(m => { initial[m.id] = true; });
        return initial;
    });

    // Comentários (preparado para futuro)
    const [commentText, setCommentText] = useState('');

    // Material ativo
    const activeMaterial = useMemo(() => {
        for (const mod of MODULES_DATA) {
            const mat = mod.materials.find(m => m.id === activeMaterialId);
            if (mat) return { ...mat, moduleTitle: mod.title, moduleId: mod.id };
        }
        return null;
    }, [activeMaterialId]);

    // Filtro de busca na sidebar
    const filteredModules = useMemo(() => {
        if (!sidebarSearch.trim()) return MODULES_DATA;
        const q = sidebarSearch.toLowerCase();
        return MODULES_DATA.map(mod => ({
            ...mod,
            materials: mod.materials.filter(m =>
                m.title.toLowerCase().includes(q)
            )
        })).filter(mod =>
            mod.title.toLowerCase().includes(q) || mod.materials.length > 0
        );
    }, [sidebarSearch]);

    // Lógica de desbloqueio de módulo
    const isModuleUnlocked = (modId) => {
        if (role === 'admin') return true;
        const modIndex = MODULES_DATA.findIndex(m => m.id === modId);
        if (modIndex <= 0) return true; // Primeiro módulo sempre liberado
        const previousMod = MODULES_DATA[modIndex - 1];
        return completedModules?.includes(previousMod.id);
    };

    // Progresso por módulo (visual, local)
    const getModuleProgress = useCallback((mod) => {
        if (!mod.materials || mod.materials.length === 0) return 0;
        const completedCount = mod.materials.filter(m => completedMaterials.includes(m.id)).length;
        return Math.round((completedCount / mod.materials.length) * 100);
    }, [completedMaterials]);

    // Navegação entre materiais
    const allMaterials = useMemo(() => {
        const all = [];
        MODULES_DATA.forEach(mod => {
            mod.materials.forEach(mat => {
                all.push({ ...mat, moduleTitle: mod.title, moduleId: mod.id });
            });
        });
        return all;
    }, []);

    const currentIndex = allMaterials.findIndex(m => m.id === activeMaterialId);

    const handlePrev = () => {
        if (currentIndex > 0) {
            const prev = allMaterials[currentIndex - 1];
            setActiveMaterialId(prev.id);
            setActiveModuleId(prev.moduleId);
        }
    };

    const handleNext = () => {
        if (currentIndex < allMaterials.length - 1) {
            const next = allMaterials[currentIndex + 1];
            setActiveMaterialId(next.id);
            setActiveModuleId(next.moduleId);
        }
    };

    const handleSelectMaterial = (moduleId, materialId) => {
        setActiveMaterialId(materialId);
        setActiveModuleId(moduleId);
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    if (!activeMaterial) {
        return (
            <div className="mv-error">
                <p>Material não encontrado.</p>
                <button onClick={onBack} className="mv-back-btn-error">Voltar ao início</button>
            </div>
        );
    }

    return (
        <div className={`material-viewer ${sidebarOpen ? '' : 'sidebar-collapsed'}`} id="material-viewer">
            {/* ====== CONTEÚDO PRINCIPAL ====== */}
            <div className="mv-main">
                {/* Header de navegação */}
                <header className="mv-header">
                    <div className="mv-header-left">
                        <button className="mv-back-btn" onClick={onBack} id="mv-back-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            Voltar
                        </button>
                    </div>
                    <div className="mv-header-right">
                        <button
                            className="mv-nav-btn"
                            onClick={handlePrev}
                            disabled={currentIndex <= 0}
                            aria-label="Material anterior"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="19 20 9 12 19 4" />
                                <line x1="5" y1="4" x2="5" y2="20" />
                            </svg>
                        </button>
                        <button
                            className="mv-nav-btn"
                            onClick={handleNext}
                            disabled={currentIndex >= allMaterials.length - 1}
                            aria-label="Próximo material"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="5 4 15 12 5 20" />
                                <line x1="19" y1="4" x2="19" y2="20" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Info do material */}
                <div className="mv-info">
                    <span className="mv-module-label">{activeMaterial.moduleTitle}</span>
                    <h1 className="mv-material-title">{activeMaterial.title}</h1>
                </div>

                {/* Barra de ações */}
                <div className="mv-actions-bar">
                    <div className="mv-actions-left">
                        <div className="mv-rating">
                            {[1, 2, 3, 4, 5].map(star => (
                                <svg key={star} className="mv-star" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            ))}
                        </div>
                    </div>
                    <div className="mv-actions-right">
                        <button 
                            className={`mv-conclude-btn ${completedMaterials.includes(activeMaterial.id) ? 'completed' : ''}`}
                            onClick={() => {
                                if (onComplete) {
                                    const currentMod = MODULES_DATA.find(m => m.id === activeMaterial.moduleId);
                                    const isLast = currentMod.materials[currentMod.materials.length - 1].id === activeMaterial.id;
                                    onComplete(activeMaterial.id, activeMaterial.moduleId, isLast);
                                }
                                handleNext();
                            }}
                        >
                            {completedMaterials.includes(activeMaterial.id) ? 'Concluído' : 'Concluir'}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </button>
                        <span className="mv-points-badge">+ 10</span>
                    </div>
                </div>

                {/* Link informações */}
                <button className="mv-info-link">Informações da aula</button>

                {/* ====== EMBED DO CANVA ====== */}
                <div className="mv-embed-container" id="mv-embed">
                    <div className="mv-embed-wrapper">
                        <iframe
                            loading="lazy"
                            className="mv-embed-iframe"
                            src={activeMaterial.embedSrc}
                            allowFullScreen
                            allow="fullscreen"
                            title={activeMaterial.title}
                        />
                    </div>
                </div>

                {/* ====== SEÇÃO DE COMENTÁRIOS ====== */}
                <section className="mv-comments" id="mv-comments">
                    <h2 className="mv-comments-title">Comentários <span className="mv-comments-count">0</span></h2>

                    <div className="mv-comment-input-row">
                        <div className="mv-comment-avatar">
                            {clerkUser?.firstName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <input
                            type="text"
                            className="mv-comment-input"
                            placeholder="Comente algo sobre a aula."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            id="mv-comment-input"
                        />
                    </div>

                    <div className="mv-comments-empty">
                        <div className="mv-comments-empty-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <h3>Ainda sem comentários por aqui</h3>
                        <p>Seja a primeira pessoa a comentar algo e inicie um tópico para trocar ideias sobre a aula.</p>
                    </div>
                </section>
            </div>

            {/* ====== SIDEBAR DE CONTEÚDOS ====== */}
            <aside className={`mv-sidebar ${sidebarOpen ? 'open' : ''}`} id="mv-sidebar">
                <div className="mv-sidebar-header">
                    <h2 className="mv-sidebar-title">Lista de Conteúdos</h2>
                    <div className="mv-sidebar-actions">
                        <button className="mv-sidebar-icon-btn" aria-label="Configurações">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </button>
                        <button
                            className="mv-sidebar-icon-btn"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Recolher sidebar"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="13 17 18 12 13 7" />
                                <polyline points="6 17 11 12 6 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Busca */}
                <div className="mv-sidebar-search">
                    <input
                        type="text"
                        placeholder="Buscar conteúdo"
                        value={sidebarSearch}
                        onChange={(e) => setSidebarSearch(e.target.value)}
                        className="mv-sidebar-search-input"
                        id="mv-sidebar-search"
                    />
                    <svg className="mv-sidebar-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </div>

                {/* Lista de módulos */}
                <div className="mv-sidebar-modules">
                    {filteredModules.map((mod, modIdx) => {
                        const unlocked = isModuleUnlocked(mod.id);
                        return (
                        <div key={mod.id} className={`mv-sidebar-module ${!unlocked ? 'locked' : ''}`}>
                            {/* Header do módulo */}
                            <button
                                className="mv-sidebar-module-header"
                                onClick={() => unlocked && toggleModule(mod.id)}
                                style={{ cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.6 }}
                            >
                                <div className="mv-sidebar-module-info">
                                    <span className="mv-sidebar-module-number">{modIdx + 1}</span>
                                    <div>
                                        <span className="mv-sidebar-module-title">
                                            {mod.title}
                                            {!unlocked && (
                                                <svg style={{ marginLeft: 6, display: 'inline' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                </svg>
                                            )}
                                        </span>
                                        <div className="mv-sidebar-module-progress-row">
                                            <span className="mv-sidebar-module-percent">{getModuleProgress(mod)}%</span>
                                            <div className="mv-sidebar-module-progress-bar">
                                                <div className="mv-sidebar-module-progress-fill" style={{ width: `${getModuleProgress(mod)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {unlocked && (
                                    <svg className={`mv-sidebar-chevron ${expandedModules[mod.id] ? '' : 'collapsed'}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="18 15 12 9 6 15" />
                                    </svg>
                                )}
                            </button>

                            {/* Lista de materiais */}
                            {expandedModules[mod.id] && (
                                <div className="mv-sidebar-materials">
                                    {mod.materials.map(mat => {
                                        const isActive = mat.id === activeMaterialId;
                                        return (
                                            <button
                                                key={mat.id}
                                                className={`mv-sidebar-material ${isActive ? 'active' : ''}`}
                                                onClick={() => handleSelectMaterial(mod.id, mat.id)}
                                            >
                                                <div className="mv-sidebar-mat-icon-wrapper">
                                                    {isActive ? (
                                                        <div className="mv-sidebar-mat-playing">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                                <polygon points="5 3 19 12 5 21 5 3" />
                                                            </svg>
                                                            <span>Tocando agora</span>
                                                        </div>
                                                    ) : (
                                                        <div className="mv-sidebar-mat-icon">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                                <polyline points="14 2 14 8 20 8" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="mv-sidebar-mat-title">{mat.title}</span>
                                                <svg className={`mv-sidebar-mat-check ${completedMaterials.includes(mat.id) ? 'completed' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={completedMaterials.includes(mat.id) ? '#10b981' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="16 10 11 15 8 12" />
                                                </svg>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )})}
                </div>
            </aside>

            {/* Botão para reabrir sidebar quando colapsada */}
            {!sidebarOpen && (
                <button
                    className="mv-sidebar-reopen"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Abrir lista de conteúdos"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="11 17 6 12 11 7" />
                        <polyline points="18 17 13 12 18 7" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default MaterialViewer;
