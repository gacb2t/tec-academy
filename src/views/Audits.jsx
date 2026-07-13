import React, { useState, useEffect } from 'react';
import { auditService } from '../services/auditService';
import { openaiService } from '../services/openaiService';
import AuditReport from '../components/audits/AuditReport';
import './Audits.css';

// Componente auxiliar para selecionar múltiplos usuários
const UserMultiSelect = ({ label, selectedUsers, onChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.length >= 3) {
                setIsSearching(true);
                const results = await auditService.searchUsers(searchTerm);
                // Filtra usuários que já foram selecionados
                const filtered = results.filter(u => !selectedUsers.find(s => s.id === u.id));
                setSearchResults(filtered);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, selectedUsers]);

    const handleAddUser = (user) => {
        onChange([...selectedUsers, user]);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleRemoveUser = (userId) => {
        onChange(selectedUsers.filter(u => u.id !== userId));
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>{label}</label>
            
            {/* Lista de selecionados */}
            {selectedUsers.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {selectedUsers.map(u => (
                        <span key={u.id} style={{
                            background: 'rgba(108, 99, 255, 0.2)',
                            color: '#e0e7ff',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            {u.name}
                            <button type="button" onClick={() => handleRemoveUser(u.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: 0 }}>&times;</button>
                        </span>
                    ))}
                </div>
            )}

            {/* Input de busca */}
            <div style={{ position: 'relative' }}>
                <input 
                    type="text" 
                    className="member-search-input" 
                    placeholder="Digite pelo menos 3 letras para buscar..."
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    style={{ width: '100%' }} 
                />
                
                {isSearching && <div style={{ position: 'absolute', right: '10px', top: '10px', color: '#666' }}>Buscando...</div>}
                
                {/* Resultados flutuantes */}
                {searchResults.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: '#2a2d3e',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        marginTop: '4px',
                        zIndex: 10,
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}>
                        {searchResults.map(u => (
                            <div 
                                key={u.id}
                                onClick={() => handleAddUser(u)}
                                style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #444' }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                                <div style={{ fontWeight: 'bold' }}>{u.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{u.role}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const Audits = ({ user }) => {
    const [folders, setFolders] = useState([]);
    const [settings, setSettings] = useState({ qualifications: [] });
    
    // UI States
    const [activeFolder, setActiveFolder] = useState(null);
    const [auditsList, setAuditsList] = useState([]);
    const [viewingReport, setViewingReport] = useState(null);
    
    // Modals
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settingsTab, setSettingsTab] = useState('qualificacoes');
    const [loading, setLoading] = useState(true);

    // Form states
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderCollaborators, setNewFolderCollaborators] = useState([]);
    const [newFolderManagers, setNewFolderManagers] = useState([]);
    
    const [auditFile, setAuditFile] = useState(null);
    const [auditQualification, setAuditQualification] = useState('');
    const [auditCollaboratorId, setAuditCollaboratorId] = useState('');
    const [auditCallDate, setAuditCallDate] = useState('');
    const [auditClientPhone, setAuditClientPhone] = useState('');
    const [auditProgress, setAuditProgress] = useState(null);
    const [auditErrorMsg, setAuditErrorMsg] = useState('');

    const [newQualifText, setNewQualifText] = useState('');

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [fetchedFolders, fetchedSettings] = await Promise.all([
                auditService.getFolders(user?.id),
                auditService.getSettings()
            ]);
            setFolders(fetchedFolders);
            setSettings(fetchedSettings);
            if (fetchedSettings.qualifications.length > 0) {
                setAuditQualification(fetchedSettings.qualifications[0]);
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenFolder = async (folder) => {
        setActiveFolder(folder);
        const audits = await auditService.getAuditsByFolder(folder.id);
        setAuditsList(audits);
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        
        if (newFolderCollaborators.length === 0 || newFolderManagers.length === 0) {
            alert("É necessário selecionar pelo menos um colaborador e um gestor.");
            return;
        }

        try {
            const newFolder = await auditService.createFolder({
                name: newFolderName,
                collaborators: newFolderCollaborators,
                managers: newFolderManagers
            });
            setFolders([{ ...newFolder, auditCount: 0, lastAudit: null }, ...folders]);
            setShowFolderModal(false);
            setNewFolderName('');
            setNewFolderCollaborators([]);
            setNewFolderManagers([]);
        } catch (error) {
            console.error(error);
            alert("Erro ao criar pasta. As tabelas do Supabase foram atualizadas?");
        }
    };

    const handleAddQualification = async () => {
        if (!newQualifText.trim()) return;
        const newQualifs = [...settings.qualifications, newQualifText.trim()];
        const newSettings = { ...settings, qualifications: newQualifs };
        
        try {
            await auditService.saveSettings(newSettings);
            setSettings(newSettings);
            setNewQualifText('');
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar qualificação.");
        }
    };

    const handleRemoveQualification = async (index) => {
        const newQualifs = settings.qualifications.filter((_, i) => i !== index);
        const newSettings = { ...settings, qualifications: newQualifs };
        try {
            await auditService.saveSettings(newSettings);
            setSettings(newSettings);
        } catch (err) {
            console.error(err);
            alert("Erro ao remover qualificação.");
        }
    };

    const handleSavePrompts = async () => {
        try {
            await auditService.saveSettings(settings);
            alert("Prompts salvos com sucesso!");
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar prompts.");
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAuditFile(e.target.files[0]);
        }
    };

    const handleStartAudit = async () => {
        if (!auditFile) {
            alert("Selecione um arquivo de áudio.");
            return;
        }
        if (!auditCollaboratorId) {
            alert("Selecione o colaborador auditado.");
            return;
        }
        
        setAuditErrorMsg('');
        let newAuditId = null;

        try {
            setAuditProgress('uploading');
            
            // 1. Fazer upload do áudio para o Storage
            const publicAudioUrl = await auditService.uploadAudio(auditFile);
            
            // 2. Extrair nome do colaborador
            const selectedCollab = activeFolder.collaborators.find(c => c.id === auditCollaboratorId);
            const collabName = selectedCollab ? selectedCollab.name : 'Desconhecido';

            // 3. Criar registro inicial no DB
            const auditRecord = await auditService.createAudit({
                folder_id: activeFolder.id,
                qualification: auditQualification,
                audio_file_name: auditFile.name,
                collaborator_id: auditCollaboratorId,
                collaborator_name: collabName,
                call_date: auditCallDate || null,
                client_phone: auditClientPhone || null,
                audio_url: publicAudioUrl
            });
            newAuditId = auditRecord.id;
            
            setAuditsList([auditRecord, ...auditsList]);
            
            setAuditProgress('transcribing');
            // 4. Whisper Transcrição
            const rawTranscription = await openaiService.transcribeAudio(auditFile, settings.promptWhisper);

            setAuditProgress('analyzing');
            // 5. GPT-4o Análise injetando o nome correto
            const analysisJson = await openaiService.analyzeTranscription(rawTranscription, collabName, settings.promptOrientado);

            // 6. Atualizar resultado
            await auditService.updateAuditResult(newAuditId, {
                status: 'concluido',
                result: analysisJson
            });

            setAuditsList(prev => prev.map(a => a.id === newAuditId ? { ...a, status: 'concluido', result: analysisJson, completed_at: new Date().toISOString() } : a));
            setAuditProgress(null);
            setShowAuditModal(false);
            setAuditFile(null);
            
            if (window.confirm("Auditoria concluída com sucesso! Deseja visualizar o relatório agora?")) {
                setViewingReport({ ...auditRecord, status: 'concluido', result: analysisJson, completed_at: new Date().toISOString() });
            }

        } catch (error) {
            console.error(error);
            setAuditErrorMsg(error.message || "Erro desconhecido durante a análise.");
            if (newAuditId) {
                await auditService.updateAuditResult(newAuditId, { status: 'erro' });
                setAuditsList(prev => prev.map(a => a.id === newAuditId ? { ...a, status: 'erro' } : a));
            }
            setAuditProgress(null);
        }
    };

    // Helper de UI para nomes
    const formatNames = (usersArr) => {
        if (!usersArr || usersArr.length === 0) return 'Nenhum';
        if (usersArr.length === 1) return usersArr[0].name;
        if (usersArr.length === 2) return `${usersArr[0].name.split(' ')[0]} e ${usersArr[1].name.split(' ')[0]}`;
        return `${usersArr.length} pessoas`;
    };

    if (viewingReport) {
        return <AuditReport audit={viewingReport} onBack={() => { setViewingReport(null); loadInitialData(); }} />;
    }

    return (
        <div className="audits-container">
            {!activeFolder ? (
                <div className="audits-header">
                    <div className="audits-header-text">
                        <h1>Auditorias de Atendimento</h1>
                        <p>Analise, transcreva e avalie interações de colaboradores com clientes.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {user?.role === 'admin' && (
                            <button className="btn-secondary" onClick={() => setShowSettingsModal(true)}>
                                ⚙️ Configurações
                            </button>
                        )}
                        <button className="audits-btn-primary" onClick={() => setShowFolderModal(true)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Nova Pasta
                        </button>
                    </div>
                </div>
            ) : (
                <div className="folder-view-header">
                    <button className="folder-back-btn" onClick={() => setActiveFolder(null)} aria-label="Voltar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <div className="folder-view-title">
                        <h2>{activeFolder.name}</h2>
                        <span>Colaboradores: {formatNames(activeFolder.collaborators)}</span>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <button className="audits-btn-primary" onClick={() => {
                            if (activeFolder && activeFolder.collaborators.length > 0) {
                                setAuditCollaboratorId(activeFolder.collaborators[0].id);
                            }
                            setShowAuditModal(true);
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Nova Auditoria
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Carregando dados...</div>
            ) : (
                <>
                    {!activeFolder ? (
                        <div className="audits-folders-grid">
                            {folders.length === 0 && <p style={{ gridColumn: '1 / -1', color: '#666' }}>Nenhuma pasta criada. Crie uma para começar.</p>}
                            {folders.map(folder => (
                                <div key={folder.id} className="audit-folder-card" onClick={() => handleOpenFolder(folder)}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div className="folder-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                            </svg>
                                        </div>
                                        <div className="folder-info">
                                            <h3>{folder.name}</h3>
                                            <p>👤 {formatNames(folder.collaborators)} | 👔 Gestores: {formatNames(folder.managers)}</p>
                                        </div>
                                    </div>
                                    <div className="folder-stats">
                                        <span>{folder.auditCount} auditorias</span>
                                        <span>Última: {folder.lastAudit ? new Date(folder.lastAudit).toLocaleDateString() : 'Nenhuma'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="audits-table-container">
                            {auditsList.length === 0 ? (
                                <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Nenhuma auditoria nesta pasta.</p>
                            ) : (
                                <table className="audits-table">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Colaborador</th>
                                            <th>Qualificação</th>
                                            <th>Nota Geral</th>
                                            <th>Status</th>
                                            <th>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditsList.map(audit => (
                                            <tr key={audit.id}>
                                                <td>{new Date(audit.created_at).toLocaleDateString()}</td>
                                                <td>{audit.collaborator_name || '-'}</td>
                                                <td>{audit.qualification}</td>
                                                <td className="audit-score">
                                                    {audit.result ? `${audit.result.nota_geral_vendedor}/10` : '-'}
                                                </td>
                                                <td>
                                                    <span className={`audit-status status-${audit.status}`}>
                                                        {audit.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {audit.status === 'concluido' && (
                                                        <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => setViewingReport(audit)}>
                                                            Ver Relatório
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Modal Nova Pasta */}
            {showFolderModal && (
                <div className="audit-modal-overlay">
                    <div className="audit-modal" style={{ overflow: 'visible' }}>
                        <div className="audit-modal-header">
                            <h3>Nova Pasta de Auditoria</h3>
                            <button className="audit-modal-close" onClick={() => setShowFolderModal(false)}>&times;</button>
                        </div>
                        <form className="audit-modal-body" onSubmit={handleCreateFolder}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Nome da Pasta</label>
                                <input required type="text" className="member-search-input" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} style={{ width: '100%' }} placeholder="Ex: Auditorias Junho - Equipe X" />
                            </div>
                            
                            <UserMultiSelect 
                                label="Colaboradores (Vendedores)" 
                                selectedUsers={newFolderCollaborators} 
                                onChange={setNewFolderCollaborators} 
                            />

                            <UserMultiSelect 
                                label="Gestores" 
                                selectedUsers={newFolderManagers} 
                                onChange={setNewFolderManagers} 
                            />

                            <div className="audit-modal-footer" style={{ marginTop: '2rem' }}>
                                <button type="button" className="btn-secondary" onClick={() => setShowFolderModal(false)}>Cancelar</button>
                                <button type="submit" className="audits-btn-primary">Criar Pasta</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Configurações */}
            {showSettingsModal && (
                <div className="audit-modal-overlay">
                    <div className="audit-modal" style={{ maxWidth: '800px', width: '90%' }}>
                        <div className="audit-modal-header">
                            <h3>Configurações da Auditoria</h3>
                            <button className="audit-modal-close" onClick={() => setShowSettingsModal(false)}>&times;</button>
                        </div>
                        
                        <div className="as-tabs" style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <button className={`as-tab ${settingsTab === 'qualificacoes' ? 'active' : ''}`} onClick={() => setSettingsTab('qualificacoes')} style={{ padding: '0.5rem 1rem' }}>Qualificações</button>
                            <button className={`as-tab ${settingsTab === 'whisper' ? 'active' : ''}`} onClick={() => setSettingsTab('whisper')} style={{ padding: '0.5rem 1rem' }}>Prompt Whisper</button>
                            <button className={`as-tab ${settingsTab === 'orientado' ? 'active' : ''}`} onClick={() => setSettingsTab('orientado')} style={{ padding: '0.5rem 1rem' }}>Prompt GPT-4o</button>
                        </div>

                        <div className="audit-modal-body" style={{ minHeight: '300px' }}>
                            {settingsTab === 'qualificacoes' && (
                                <div>
                                    <p style={{ color: '#aaa', marginBottom: '1rem', fontSize: '0.9rem' }}>Cadastre as qualificações (motivos da ligação) vindas da discadora para categorizar as auditorias.</p>
                                    <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem' }}>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {settings.qualifications.map((q, idx) => (
                                                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '4px' }}>
                                                    {q}
                                                    <button onClick={() => handleRemoveQualification(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Remover</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input type="text" className="member-search-input" placeholder="Nova Qualificação" value={newQualifText} onChange={e => setNewQualifText(e.target.value)} />
                                        <button className="audits-btn-primary" onClick={handleAddQualification}>Adicionar</button>
                                    </div>
                                </div>
                            )}

                            {settingsTab === 'whisper' && (
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <p style={{ color: '#aaa', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                        O prompt do modelo Whisper orienta a transcrição a reconhecer nomes específicos e acrônimos (Ex: "A nossa empresa se chama TEC-B2, vendemos produtos da Vivo").
                                    </p>
                                    <textarea 
                                        className="gamified-input" 
                                        style={{ width: '100%', minHeight: '150px', padding: '1rem', flexGrow: 1, resize: 'vertical' }}
                                        value={settings.promptWhisper || ''}
                                        onChange={e => setSettings({ ...settings, promptWhisper: e.target.value })}
                                        placeholder="Insira o contexto para a transcrição de áudio..."
                                    />
                                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                        <button className="audits-btn-primary" onClick={handleSavePrompts}>Salvar Prompt</button>
                                    </div>
                                </div>
                            )}

                            {settingsTab === 'orientado' && (
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <p style={{ color: '#aaa', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                        O System Prompt principal do GPT-4o. Defina o comportamento do auditor, as regras de avaliação, e a lista de cursos sugeridos. 
                                        <br/>Use <code style={{ color: '#6C63FF' }}>{'{NOME_DO_COLABORADOR}'}</code> onde desejar injetar o nome do colaborador avaliado. O JSON Schema já está forçado pela API.
                                    </p>
                                    <textarea 
                                        className="gamified-input" 
                                        style={{ width: '100%', minHeight: '250px', padding: '1rem', flexGrow: 1, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }}
                                        value={settings.promptOrientado || ''}
                                        onChange={e => setSettings({ ...settings, promptOrientado: e.target.value })}
                                        placeholder="Você é um auditor..."
                                    />
                                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                        <button className="audits-btn-primary" onClick={handleSavePrompts}>Salvar Prompt</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Nova Auditoria */}
            {showAuditModal && (
                <div className="audit-modal-overlay">
                    <div className="audit-modal">
                        <div className="audit-modal-header">
                            <h3>Nova Auditoria IA</h3>
                            <button className="audit-modal-close" onClick={() => setShowAuditModal(false)} disabled={auditProgress}>&times;</button>
                        </div>
                        <div className="audit-modal-body">
                            {/* Nova Seleção de Colaborador */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Colaborador Auditado</label>
                                <select 
                                    className="department-select" 
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px' }}
                                    value={auditCollaboratorId}
                                    onChange={e => setAuditCollaboratorId(e.target.value)}
                                    disabled={auditProgress}
                                >
                                    {activeFolder?.collaborators?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Qualificação */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Qualificação da Chamada</label>
                                <select 
                                    className="department-select" 
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px' }}
                                    value={auditQualification}
                                    onChange={e => setAuditQualification(e.target.value)}
                                    disabled={auditProgress}
                                >
                                    {settings.qualifications.map((q, idx) => (
                                        <option key={idx} value={q}>{q}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Data e Telefone */}
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Data da Ligação</label>
                                    <input 
                                        type="date" 
                                        className="member-search-input" 
                                        style={{ width: '100%' }}
                                        value={auditCallDate}
                                        onChange={e => setAuditCallDate(e.target.value)}
                                        disabled={auditProgress}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Número do Cliente</label>
                                    <input 
                                        type="tel" 
                                        className="member-search-input" 
                                        style={{ width: '100%' }}
                                        placeholder="(00) 00000-0000"
                                        value={auditClientPhone}
                                        onChange={e => setAuditClientPhone(e.target.value)}
                                        disabled={auditProgress}
                                    />
                                </div>
                            </div>

                            <div className="audit-dropzone" style={{ pointerEvents: auditProgress ? 'none' : 'auto', opacity: auditProgress ? 0.5 : 1 }}>
                                <div className="dropzone-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                </div>
                                <p>Selecione o arquivo de áudio (.mp3, .wav, .m4a)</p>
                                <input type="file" accept="audio/*" onChange={handleFileChange} disabled={auditProgress} style={{ marginTop: '1rem' }} />
                                {auditFile && <p style={{ color: '#00D4AA', marginTop: '0.5rem' }}>Selecionado: {auditFile.name}</p>}
                            </div>

                            {auditProgress && (
                                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                    <p style={{ color: '#6C63FF', fontWeight: 'bold' }}>
                                        {auditProgress === 'uploading' && 'Iniciando auditoria...'}
                                        {auditProgress === 'transcribing' && 'Transcrevendo áudio com Whisper...'}
                                        {auditProgress === 'analyzing' && 'Avaliando critérios com Inteligência Artificial...'}
                                    </p>
                                    <div className="member-hero-progress-bar" style={{ marginTop: '0.5rem' }}>
                                        <div className="member-hero-progress-fill" style={{ width: auditProgress === 'uploading' ? '10%' : auditProgress === 'transcribing' ? '50%' : '90%', transition: 'width 2s' }}></div>
                                    </div>
                                </div>
                            )}
                            {auditErrorMsg && (
                                <div style={{ marginTop: '1rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '6px' }}>
                                    Erro: {auditErrorMsg}
                                </div>
                            )}
                        </div>
                        <div className="audit-modal-footer">
                            <button className="btn-secondary" onClick={() => setShowAuditModal(false)} disabled={auditProgress}>Cancelar</button>
                            <button className="audits-btn-primary" onClick={handleStartAudit} disabled={auditProgress || !auditFile}>
                                {auditProgress ? 'Processando...' : 'Iniciar Análise IA'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Audits;
