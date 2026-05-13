import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import './AdminSettings.css';

/**
 * AdminSettings — Painel de administração estilo Hotmart
 * Tabs: Conteúdo, Turmas, Usuários, Comentários, Certificado
 * Sub-tabs (Conteúdo): Principal, Adicional, Trilhas
 */

// Mapeamento de roles para labels amigáveis
const ROLE_OPTIONS = [
    { value: 'colaborador', label: 'Colaborador' },
    { value: 'gestor', label: 'Gestor' },
    { value: 'admin', label: 'Administrador' },
];

const getRoleLabel = (role) => {
    const found = ROLE_OPTIONS.find(r => r.value === role);
    return found ? found.label : 'Colaborador';
};

/**
 * UserRow — Linha individual da tabela de usuários
 * Permite edição de role via select dropdown
 */
const UserRow = ({ user: u, onRoleUpdated }) => {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleRoleChange = async (newRole) => {
        if (newRole === (u.role || 'colaborador')) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ role: newRole })
                .eq('user_id', u.user_id);

            if (error) throw error;

            onRoleUpdated(u.id || u.user_id, newRole);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Erro ao atualizar role:", err);
            alert("Erro ao atualizar permissão do usuário.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <tr>
            <td>
                <div className="as-user-cell">
                    <div className="as-user-avatar">
                        {(u.name || u.full_name || u.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <span className="as-user-name">{u.name || u.full_name || 'Sem nome'}</span>
                        <span className="as-user-email">{u.email || '—'}</span>
                    </div>
                </div>
            </td>
            <td>
                <span className="as-dept-tag">{u.department || '—'}</span>
            </td>
            <td>
                <div className="as-role-select-wrapper">
                    <select
                        className={`as-role-select ${u.role === 'admin' ? 'admin' : u.role === 'gestor' ? 'gestor' : ''}`}
                        value={u.role || 'colaborador'}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        disabled={saving}
                    >
                        {ROLE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {saving && <span className="as-role-saving">Salvando...</span>}
                    {saved && <span className="as-role-saved">✓</span>}
                </div>
            </td>
            <td className="as-date-cell">
                {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '—'}
            </td>
        </tr>
    );
};

const AdminSettings = ({ onViewChange, onBack }) => {
    // Tabs principais
    const [activeTab, setActiveTab] = useState('conteudo');
    // Sub-tabs de Conteúdo
    const [contentSubTab, setContentSubTab] = useState('principal');

    // Dados
    const [users, setUsers] = useState([]);
    const [expandedModules, setExpandedModules] = useState({ 'mod-welcome': true });

    // Materiais Canva — módulos estáticos (mesma fonte do MaterialViewer)
    const ADMIN_MODULES = [
        {
            id: 'mod-welcome',
            title: 'Bem-vindo(a) a TEC-B2!',
            icon: '🏢',
            materials: [
                { id: 'mat-rh', title: '01 - Recursos Humanos', type: 'Apresentação Canva', status: 'Publicado' },
                { id: 'mat-sistemas', title: '02 - Sistemas, Ferramentas e Funis', type: 'Apresentação Canva', status: 'Publicado' },
            ],
        },
    ];

    // Carregar usuários
    const fetchUsers = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setUsers(data || []);
        } catch (err) {
            console.error("Erro ao carregar usuários:", err);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Toggle expansão de módulo
    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // Ações de conteúdo
    const handleCreateCourse = () => {
        // onViewChange('course-builder', { courseId: null }); // Placeholder
        alert('Criação de novos conteúdos será liberada na próxima versão.');
    };

    const handleEditCourse = (moduleId) => {
        // onViewChange('course-builder', { courseId: moduleId }); // Placeholder
        alert('Edição de conteúdo em breve.');
    };

    // Tabs config
    const mainTabs = [
        { key: 'conteudo', label: 'Conteúdo' },
        { key: 'turmas', label: 'Turmas' },
        { key: 'usuarios', label: 'Usuários' },
        { key: 'comentarios', label: 'Comentários' },
        { key: 'certificado', label: 'Certificado' },
    ];

    const contentSubTabs = [
        { key: 'principal', label: 'Principal' },
        { key: 'adicional', label: 'Adicional' },
        { key: 'trilhas', label: 'Trilhas' },
    ];

    // Contagem total de materiais
    const totalContents = ADMIN_MODULES.reduce((sum, m) => sum + m.materials.length, 0);

    return (
        <div className="admin-settings" id="admin-settings">
            {/* Header do painel */}
            <header className="as-header">
                <div className="as-header-left">
                    <button className="as-back-btn" onClick={onBack} aria-label="Voltar" id="admin-back-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <div className="as-header-info">
                        <h1 className="as-title">EduTec - Treinamentos</h1>
                        <div className="as-meta">
                            <span className="as-meta-type">Curso Online</span>
                            <span className="as-meta-badge active">Vendas ativas</span>
                        </div>
                    </div>
                </div>

                <div className="as-header-actions">
                    <button className="as-action-btn" aria-label="Visualizar" title="Pré-visualizar">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>
                    <button className="as-action-btn" aria-label="Filtrar" title="Filtrar">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                    </button>
                    <button className="as-action-btn" aria-label="Configurações" title="Configurações avançadas">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Tabs principais */}
            <div className="as-tabs" id="admin-main-tabs">
                {mainTabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`as-tab ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                        id={`admin-tab-${tab.key}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ====== TAB CONTEÚDO ====== */}
            {activeTab === 'conteudo' && (
                <div className="as-content-tab">
                    {/* Sub-tabs */}
                    <div className="as-subtabs-row">
                        <div className="as-subtabs" id="admin-sub-tabs">
                            {contentSubTabs.map(sub => (
                                <button
                                    key={sub.key}
                                    className={`as-subtab ${contentSubTab === sub.key ? 'active' : ''}`}
                                    onClick={() => setContentSubTab(sub.key)}
                                    id={`admin-subtab-${sub.key}`}
                                >
                                    {sub.label}
                                </button>
                            ))}
                        </div>

                        <div className="as-subtabs-actions">
                            <button className="as-search-btn" aria-label="Buscar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </button>
                            <button className="as-upload-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                Enviar arquivos
                            </button>
                            <button className="as-create-btn" onClick={handleCreateCourse} id="admin-create-btn">
                                Criar
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Conteúdo principal — módulos com materiais Canva */}
                    {contentSubTab === 'principal' && (
                        <div className="as-principal-content">
                            {/* Selecionar todos */}
                            <div className="as-select-all-row">
                                <label className="as-checkbox-label">
                                    <input type="checkbox" className="as-checkbox" />
                                    <span>Selecionar todos</span>
                                </label>
                                <button className="as-expand-all-btn" aria-label="Expandir">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 3 21 3 21 9" />
                                        <polyline points="9 21 3 21 3 15" />
                                        <line x1="21" y1="3" x2="14" y2="10" />
                                        <line x1="3" y1="21" x2="10" y2="14" />
                                    </svg>
                                </button>
                            </div>

                            {/* Lista de módulos com materiais */}
                            <div className="as-modules-list">
                                {ADMIN_MODULES.map((mod) => (
                                    <div key={mod.id} className="as-module-group" id={`admin-module-${mod.id}`}>
                                        {/* Cabeçalho do módulo */}
                                        <div className="as-module-header">
                                            <div className="as-module-header-left">
                                                <span className="as-module-icon">{mod.icon}</span>
                                                <div className="as-module-info">
                                                    <h3 className="as-module-title">{mod.title}</h3>
                                                    <div className="as-module-meta">
                                                        <span className="as-module-badge">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                                                <line x1="8" y1="21" x2="16" y2="21" />
                                                                <line x1="12" y1="17" x2="12" y2="21" />
                                                            </svg>
                                                            Módulo principal
                                                        </span>
                                                        <span className="as-module-count">
                                                            {mod.materials.length} conteúdo{mod.materials.length !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="as-module-header-right">
                                                <button className="as-icon-btn" aria-label="Adicionar" title="Adicionar material">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="12" y1="5" x2="12" y2="19" />
                                                        <line x1="5" y1="12" x2="19" y2="12" />
                                                    </svg>
                                                </button>
                                                <button className="as-icon-btn" aria-label="Mais opções" title="Mais opções">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="1" />
                                                        <circle cx="12" cy="5" r="1" />
                                                        <circle cx="12" cy="19" r="1" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className={`as-icon-btn as-chevron ${expandedModules[mod.id] === false ? 'collapsed' : ''}`}
                                                    onClick={() => toggleModule(mod.id)}
                                                    aria-label="Expandir/Recolher"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="18 15 12 9 6 15" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Lista de materiais dentro do módulo */}
                                        {expandedModules[mod.id] !== false && (
                                            <div className="as-module-contents">
                                                {mod.materials.map((mat, idx) => (
                                                    <div key={mat.id} className="as-content-item">
                                                        <div className="as-content-item-left">
                                                            <div className="as-drag-handle" aria-label="Arrastar">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                                                                    <circle cx="8" cy="6" r="1.5" />
                                                                    <circle cx="16" cy="6" r="1.5" />
                                                                    <circle cx="8" cy="12" r="1.5" />
                                                                    <circle cx="16" cy="12" r="1.5" />
                                                                    <circle cx="8" cy="18" r="1.5" />
                                                                    <circle cx="16" cy="18" r="1.5" />
                                                                </svg>
                                                            </div>
                                                            <input type="checkbox" className="as-checkbox" />
                                                            <div className="as-content-type-icon">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                                    <polyline points="14 2 14 8 20 8" />
                                                                </svg>
                                                            </div>
                                                            <div className="as-content-info">
                                                                <span className="as-content-name">{mat.title}</span>
                                                                <span className="as-content-type-label">{mat.type}</span>
                                                            </div>
                                                        </div>

                                                        <div className="as-content-item-right">
                                                            <span className="as-status-badge published">{mat.status}</span>
                                                            <button className="as-icon-btn-sm" aria-label="Mais opções">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <circle cx="12" cy="12" r="1" />
                                                                    <circle cx="12" cy="5" r="1" />
                                                                    <circle cx="12" cy="19" r="1" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Botão adicionar */}
                                                <button className="as-add-content-btn">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="12" y1="5" x2="12" y2="19" />
                                                        <line x1="5" y1="12" x2="19" y2="12" />
                                                    </svg>
                                                    Adicionar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sub-tab Adicional */}
                    {contentSubTab === 'adicional' && (
                        <div className="as-placeholder-tab">
                            <div className="as-placeholder-icon">📁</div>
                            <h3>Conteúdo Adicional</h3>
                            <p>Materiais complementares, downloads e recursos extras ficam aqui.</p>
                            <p className="as-placeholder-hint">Em breve você poderá adicionar PDFs, planilhas e outros materiais de apoio.</p>
                        </div>
                    )}

                    {/* Sub-tab Trilhas */}
                    {contentSubTab === 'trilhas' && (
                        <div className="as-placeholder-tab">
                            <div className="as-placeholder-icon">🛤️</div>
                            <h3>Trilhas de Aprendizado</h3>
                            <p>Organize seus conteúdos em trilhas sequenciais para guiar os colaboradores.</p>
                            <p className="as-placeholder-hint">Em breve você poderá criar trilhas personalizadas combinando módulos existentes.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ====== TAB TURMAS ====== */}
            {activeTab === 'turmas' && (
                <div className="as-tab-content">
                    <div className="as-placeholder-tab">
                        <div className="as-placeholder-icon">👥</div>
                        <h3>Turmas</h3>
                        <p>Gerencie turmas e organize os colaboradores em grupos de aprendizado.</p>
                        <p className="as-placeholder-hint">Defina prazos, acompanhe o desempenho coletivo e envie comunicados por turma.</p>
                    </div>
                </div>
            )}

            {/* ====== TAB USUÁRIOS ====== */}
            {activeTab === 'usuarios' && (
                <div className="as-tab-content">
                    <div className="as-users-header">
                        <h2>Usuários cadastrados</h2>
                        <span className="as-users-count">{users.length} usuário{users.length !== 1 ? 's' : ''}</span>
                    </div>

                    {users.length === 0 ? (
                        <div className="as-placeholder-tab">
                            <div className="as-placeholder-icon">👤</div>
                            <h3>Nenhum usuário cadastrado</h3>
                        </div>
                    ) : (
                        <div className="as-users-table-wrapper">
                            <table className="as-users-table">
                                <thead>
                                    <tr>
                                        <th>Usuário</th>
                                        <th>Cargo</th>
                                        <th>Permissão</th>
                                        <th>Cadastro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <UserRow
                                            key={u.id || u.user_id}
                                            user={u}
                                            onRoleUpdated={(userId, newRole) => {
                                                setUsers(prev => prev.map(usr =>
                                                    (usr.id || usr.user_id) === userId
                                                        ? { ...usr, role: newRole }
                                                        : usr
                                                ));
                                            }}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ====== TAB COMENTÁRIOS ====== */}
            {activeTab === 'comentarios' && (
                <div className="as-tab-content">
                    <div className="as-placeholder-tab">
                        <div className="as-placeholder-icon">💬</div>
                        <h3>Comentários</h3>
                        <p>Visualize e modere os comentários dos colaboradores nos treinamentos.</p>
                        <p className="as-placeholder-hint">Em breve você poderá responder e aprovar comentários diretamente por aqui.</p>
                    </div>
                </div>
            )}

            {/* ====== TAB CERTIFICADO ====== */}
            {activeTab === 'certificado' && (
                <div className="as-tab-content">
                    <div className="as-placeholder-tab">
                        <div className="as-placeholder-icon">🏆</div>
                        <h3>Certificados</h3>
                        <p>Configure modelos de certificado emitidos ao concluir os treinamentos.</p>
                        <p className="as-placeholder-hint">Personalize a identidade visual, dados exibidos e regras de emissão.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
