import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../services/supabaseClient';
import './Candidates.css';

const TEAMS = [
    'Time Farm', 'Time Hunter', 'Backoffice', 
    'Recursos Humanos', 'Suporte ao cliente', 'Time NOQ'
];

const STAGES = [
    'Inscrição realizada',
    'Contatar',
    '1ª entrevista agendada',
    '2ª entrevista agendada',
    'Contratado',
    'Não adequado'
];

const Candidates = () => {
    const [selectedTeam, setSelectedTeam] = useState(TEAMS[0]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Novos estados
    const [showWebhook, setShowWebhook] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [newCandidate, setNewCandidate] = useState({ name: '', email: '', phone: '', stage: STAGES[0] });
    const [isCreating, setIsCreating] = useState(false);
    
    // Configurações para exibir o Webhook
    const apiUrl = import.meta.env.VITE_SUPABASE_URL + '/functions/v1/inlead-webhook';

    useEffect(() => {
        fetchCandidates();
    }, [selectedTeam]);

    const fetchCandidates = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('job_applications')
            .select('*')
            .eq('team', selectedTeam)
            .order('created_at', { ascending: false });
        
        if (!error && data) {
            setCandidates(data);
        }
        setLoading(false);
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId) {
            // Se soltar na mesma coluna, não fazemos nada no momento (sem ordenação manual)
            return;
        }

        const newStage = destination.droppableId;
        
        // Atualização Otimista da Interface
        const updatedCandidates = candidates.map(c => 
            c.id === draggableId ? { ...c, stage: newStage, updated_at: new Date().toISOString() } : c
        );
        setCandidates(updatedCandidates);

        // Atualização no Supabase
        const { error } = await supabase
            .from('job_applications')
            .update({ stage: newStage, updated_at: new Date().toISOString() })
            .eq('id', draggableId);

        if (error) {
            console.error("Erro ao mover candidato:", error);
            fetchCandidates(); // Reverte em caso de erro
        }
    };

    const handleDeleteCandidate = async (e, cand) => {
        e.preventDefault();
        if (window.confirm(`Tem certeza que deseja deletar a inscrição de ${cand.name}?`)) {
            const { error } = await supabase
                .from('job_applications')
                .delete()
                .eq('id', cand.id);
            
            if (error) {
                console.error("Erro ao deletar:", error);
                alert("Erro ao deletar inscrição.");
            } else {
                fetchCandidates();
            }
        }
    };

    const handleCreateCandidate = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        const { error } = await supabase
            .from('job_applications')
            .insert({
                team: selectedTeam,
                name: newCandidate.name,
                email: newCandidate.email,
                phone: newCandidate.phone,
                stage: newCandidate.stage
            });
        
        if (error) {
            console.error("Erro ao criar candidato:", error);
            alert("Erro ao salvar inscrição.");
        } else {
            setNewCandidate({ name: '', email: '', phone: '', stage: STAGES[0] });
            setShowNewModal(false);
            fetchCandidates();
        }
        setIsCreating(false);
    };

    return (
        <div className="candidates-view fade-in">
            <div className="c-header">
                <div className="c-header-left">
                    <h1>Pipeline de Candidatos</h1>
                    <p>Acompanhe os candidatos e o processo seletivo por time.</p>
                </div>
                <div className="c-header-right" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select className="gamified-input" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                        {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button className="as-create-btn" onClick={() => setShowNewModal(true)}>+ Nova inscrição</button>
                </div>
            </div>

            <div className="c-webhook-card" style={{ padding: showWebhook ? '1.25rem 1.5rem' : '0.8rem 1.5rem', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowWebhook(!showWebhook)}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                        🔗 Webhook Direto ({selectedTeam})
                    </h3>
                    <button className="as-icon-btn-sm" style={{ padding: '0.2rem' }}>
                        {showWebhook ? '👁️‍🗨️' : '👁️'}
                    </button>
                </div>
                
                {showWebhook && (
                    <div style={{ marginTop: '1rem' }}>
                        <p>Para enviar candidatos da Inlead diretamente para este time, configure o Webhook apontando para a URL abaixo. <strong>Atenção:</strong> O time já está incluso no link.</p>
                        
                        <div className="c-webhook-code">
                            <pre>
                                URL: {apiUrl}?team={encodeURIComponent(selectedTeam)}{'\n'}
                                Método: POST{'\n'}
                                TOKEN: {import.meta.env.VITE_SUPABASE_ANON_KEY}
                            </pre>
                        </div>
                        <small style={{ color: '#aaa', display: 'block', marginTop: '0.5rem' }}>* Cole o valor acima no campo <strong>TOKEN</strong> da Inlead para permitir a autenticação.</small>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="c-loading">Carregando candidatos...</div>
            ) : (
                <div className="kanban-board">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {STAGES.map(stage => {
                            const stageCandidates = candidates.filter(c => c.stage === stage);
                            return (
                                <Droppable key={stage} droppableId={stage}>
                                    {(provided, snapshot) => (
                                        <div 
                                            className={`kanban-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            <h3 className="kanban-column-title">
                                                {stage} <span className="k-count">{stageCandidates.length}</span>
                                            </h3>
                                            <div className="kanban-cards-container">
                                                {stageCandidates.map((cand, index) => (
                                                    <Draggable key={cand.id} draggableId={cand.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                onClick={() => setSelectedCandidate(cand)}
                                                                onContextMenu={(e) => handleDeleteCandidate(e, cand)}
                                                            >
                                                                <h4>{cand.name}</h4>
                                                                <div className="k-card-info">
                                                                    <span>📧 {cand.email || '—'}</span>
                                                                    <span>📱 {cand.phone || '—'}</span>
                                                                </div>
                                                                <div className="k-card-footer">
                                                                    <small>Inscrito: {new Date(cand.created_at).toLocaleDateString('pt-BR')}</small>
                                                                    {cand.updated_at !== cand.created_at && (
                                                                        <small title="Última atualização">↻ {new Date(cand.updated_at).toLocaleDateString('pt-BR')}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            );
                        })}
                    </DragDropContext>
                </div>
            )}

            {/* Modal Detalhes do Candidato */}
            {selectedCandidate && (
                <>
                    <div className="as-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setSelectedCandidate(null)} />
                    <div className="welcome-login-box" style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        zIndex: 1000, background: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', width: '600px', maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: '#fff' }}>Detalhes da Inscrição</h3>
                            <button onClick={() => setSelectedCandidate(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#ccc' }}>
                            <p style={{ margin: 0 }}><strong>Nome:</strong> {selectedCandidate.name}</p>
                            <p style={{ margin: 0 }}><strong>E-mail:</strong> {selectedCandidate.email || 'Não informado'}</p>
                            <p style={{ margin: 0 }}><strong>Telefone:</strong> {selectedCandidate.phone || 'Não informado'}</p>
                            <p style={{ margin: 0 }}><strong>Time:</strong> {selectedCandidate.team}</p>
                            <p style={{ margin: 0 }}><strong>Etapa Atual:</strong> {selectedCandidate.stage}</p>
                            <p style={{ margin: 0 }}><strong>Data de Inscrição:</strong> {new Date(selectedCandidate.created_at).toLocaleString('pt-BR')}</p>
                            
                            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />
                            
                            {selectedCandidate.score !== null && selectedCandidate.score !== undefined && (
                                <div style={{ background: 'rgba(108, 99, 255, 0.1)', border: '1px solid var(--primary)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                    <h4 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        ⭐ Score do Candidato: {selectedCandidate.score}
                                    </h4>
                                </div>
                            )}

                            {selectedCandidate.responses && Object.keys(selectedCandidate.responses).length > 0 && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <h4 style={{ margin: '0 0 1rem 0', color: '#fff' }}>Respostas do Formulário</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                        {Object.entries(selectedCandidate.responses).map(([key, value]) => {
                                            // Formata a chave para exibição, ex: "pergunta_idade" -> "Idade" ou mantem "Pergunta Idade"
                                            const formattedKey = key.replace(/^(opcoes_|pergunta_)/i, '') // Remove o prefixo
                                                                    .replace(/_/g, ' '); // Troca underscore por espaço
                                            const displayKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
                                            
                                            return (
                                                <div key={key} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
                                                    <small style={{ color: '#888', display: 'block', marginBottom: '0.25rem' }}>{key}</small>
                                                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{displayKey}</strong>
                                                    <p style={{ margin: '0.5rem 0 0 0', color: '#ddd', lineHeight: '1.4' }}>{String(value)}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <details>
                                <summary style={{ cursor: 'pointer', color: '#888', fontSize: '0.85rem' }}>Ver Payload Completo JSON (Dados do Banco)</summary>
                                <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '6px', overflowX: 'auto', fontSize: '0.75rem', marginTop: '1rem', color: '#aaa' }}>
                                    {JSON.stringify(selectedCandidate, null, 2)}
                                </pre>
                            </details>
                        </div>
                    </div>
                </>
            )}

            {/* Modal de Nova Inscrição */}
            {showNewModal && (
                <>
                    <div className="as-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setShowNewModal(false)} />
                    <div className="welcome-login-box" style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        zIndex: 1000, background: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', width: '400px', maxWidth: '90vw'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#fff' }}>Nova Inscrição ({selectedTeam})</h3>
                        <form onSubmit={handleCreateCandidate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label style={{ color: '#ccc', fontSize: '0.85rem' }}>Nome *</label>
                                <input required className="gamified-input" value={newCandidate.name} onChange={e => setNewCandidate({...newCandidate, name: e.target.value})} placeholder="Nome do candidato" />
                            </div>
                            <div className="form-group">
                                <label style={{ color: '#ccc', fontSize: '0.85rem' }}>E-mail</label>
                                <input type="email" className="gamified-input" value={newCandidate.email} onChange={e => setNewCandidate({...newCandidate, email: e.target.value})} placeholder="email@exemplo.com" />
                            </div>
                            <div className="form-group">
                                <label style={{ color: '#ccc', fontSize: '0.85rem' }}>Telefone</label>
                                <input className="gamified-input" value={newCandidate.phone} onChange={e => setNewCandidate({...newCandidate, phone: e.target.value})} placeholder="(11) 99999-9999" />
                            </div>
                            <div className="form-group">
                                <label style={{ color: '#ccc', fontSize: '0.85rem' }}>Etapa</label>
                                <select className="gamified-input" value={newCandidate.stage} onChange={e => setNewCandidate({...newCandidate, stage: e.target.value})}>
                                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="as-tab" onClick={() => setShowNewModal(false)}>Cancelar</button>
                                <button type="submit" className="as-create-btn" disabled={isCreating}>
                                    {isCreating ? 'Criando...' : 'Adicionar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default Candidates;
