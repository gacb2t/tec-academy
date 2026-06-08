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
    const [showNewModal, setShowNewModal] = useState(false);
    const [newCandidate, setNewCandidate] = useState({ name: '', email: '', phone: '', stage: STAGES[0] });
    const [isCreating, setIsCreating] = useState(false);
    
    // Configurações para exibir o Webhook
    const apiUrl = import.meta.env.VITE_SUPABASE_URL + '/rest/v1/job_applications';
    const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
                        <p>Para enviar candidatos diretamente para a coluna "Inscrição realizada" deste time, faça um <strong>POST</strong> para a URL abaixo enviando um JSON com: <br/><code>{`{ "team": "${selectedTeam}", "name": "Nome", "email": "email", "phone": "119..." }`}</code></p>
                        
                        <div className="c-webhook-code">
                            <pre>
                                URL: {apiUrl}{'\n'}
                                Headers:{'\n'}
                                apikey: {apiKey}{'\n'}
                                Authorization: Bearer {apiKey}{'\n'}
                                Content-Type: application/json
                            </pre>
                        </div>
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
