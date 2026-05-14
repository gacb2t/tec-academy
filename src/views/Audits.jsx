import React, { useState } from 'react';
import './Audits.css';

const MOCK_FOLDERS = [
    { id: 'f1', name: 'João Silva', role: 'Consultor de Vendas', auditCount: 12, lastAudit: '12/05/2026' },
    { id: 'f2', name: 'Maria Souza', role: 'Consultor de Vendas', auditCount: 8, lastAudit: '10/05/2026' },
    { id: 'f3', name: 'Pedro Almeida', role: 'Suporte ao Cliente', auditCount: 15, lastAudit: '11/05/2026' },
    { id: 'f4', name: 'Ana Costa', role: 'Time Hunter', auditCount: 5, lastAudit: '08/05/2026' },
];

const MOCK_AUDITS = [
    { id: 'a1', date: '12/05/2026', type: 'Ligação', score: '95/100', status: 'Concluído' },
    { id: 'a2', date: '05/05/2026', type: 'WhatsApp', score: '88/100', status: 'Concluído' },
    { id: 'a3', date: '01/05/2026', type: 'Ligação', score: '-', status: 'Pendente' },
];

const Audits = ({ user }) => {
    const [activeFolder, setActiveFolder] = useState(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [auditType, setAuditType] = useState('audio');

    const handleOpenFolder = (folder) => {
        setActiveFolder(folder);
    };

    return (
        <div className="audits-container">
            {/* Header Principal ou Header da Pasta */}
            {!activeFolder ? (
                <div className="audits-header">
                    <div className="audits-header-text">
                        <h1>Auditorias de Atendimento</h1>
                        <p>Analise, transcreva e avalie interações de colaboradores com clientes.</p>
                    </div>
                    <button className="audits-btn-primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nova Pasta
                    </button>
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
                        <span>{activeFolder.role}</span>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <button className="audits-btn-primary" onClick={() => setShowNewModal(true)}>
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

            {/* Grid de Pastas ou Lista de Auditorias */}
            {!activeFolder ? (
                <div className="audits-folders-grid">
                    {MOCK_FOLDERS.map(folder => (
                        <div key={folder.id} className="audit-folder-card" onClick={() => handleOpenFolder(folder)}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div className="folder-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
                                <div className="folder-info">
                                    <h3>{folder.name}</h3>
                                    <p>{folder.role}</p>
                                </div>
                            </div>
                            <div className="folder-stats">
                                <span>{folder.auditCount} auditorias</span>
                                <span>Última: {folder.lastAudit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="audits-table-container">
                    <table className="audits-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Tipo</th>
                                <th>Nota (IA)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_AUDITS.map(audit => (
                                <tr key={audit.id}>
                                    <td>{audit.date}</td>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {audit.type === 'Ligação' ? '📞' : '💬'} {audit.type}
                                        </span>
                                    </td>
                                    <td className="audit-score">{audit.score}</td>
                                    <td>
                                        <span className={`audit-status status-${audit.status === 'Concluído' ? 'completed' : 'pending'}`}>
                                            {audit.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de Nova Auditoria */}
            {showNewModal && (
                <div className="audit-modal-overlay">
                    <div className="audit-modal">
                        <div className="audit-modal-header">
                            <h3>Nova Auditoria IA</h3>
                            <button className="audit-modal-close" onClick={() => setShowNewModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="audit-modal-body">
                            <div className="audit-type-selector">
                                <button 
                                    className={`type-btn ${auditType === 'audio' ? 'active' : ''}`}
                                    onClick={() => setAuditType('audio')}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                        <line x1="12" y1="19" x2="12" y2="23"></line>
                                        <line x1="8" y1="23" x2="16" y2="23"></line>
                                    </svg>
                                    Áudio (Ligação)
                                </button>
                                <button 
                                    className={`type-btn ${auditType === 'text' ? 'active' : ''}`}
                                    onClick={() => setAuditType('text')}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    Imagens (Mensagens)
                                </button>
                            </div>

                            <div className="audit-dropzone">
                                <div className="dropzone-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                </div>
                                <p>Arraste e solte o {auditType === 'audio' ? 'arquivo de áudio' : 'print da conversa'} aqui</p>
                                <span>ou clique para selecionar</span>
                            </div>
                        </div>
                        <div className="audit-modal-footer">
                            <button className="btn-secondary" onClick={() => setShowNewModal(false)}>Cancelar</button>
                            <button className="audits-btn-primary" onClick={() => setShowNewModal(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                Iniciar Análise IA
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Audits;
