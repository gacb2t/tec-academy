import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../services/supabaseClient';
import Button from './Button';
import './CandidatesCRM.css';

const STATUS_COLUMNS = ['Nova inscrição', 'Em contato', 'Meet agendado', 'Entrevista agendada', 'Aprovado', 'Reprovado'];

const CandidatesCRM = () => {
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [draggingId, setDraggingId] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');

    // Form Modal State
    const [showForm, setShowForm] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [selectedDetailCandidate, setSelectedDetailCandidate] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        status: 'Nova inscrição',
        curriculum_link: '',
        notes: '',
        email: '',
        phone: ''
    });

    const fetchCandidates = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('candidates')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCandidates(data || []);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingCandidate) {
                const { error } = await supabase
                    .from('candidates')
                    .update(formData)
                    .eq('id', editingCandidate.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('candidates')
                    .insert([formData]);
                if (error) throw error;
            }

            setShowForm(false);
            setEditingCandidate(null);
            fetchCandidates();
        } catch (error) {
            console.error("Error saving candidate:", error);
            alert("Erro ao salvar candidato. Verifique o console.");
        }
    };

    const handleEdit = (candidate) => {
        setEditingCandidate(candidate);
        setFormData({
            name: candidate.name,
            role: candidate.role,
            status: candidate.status,
            curriculum_link: candidate.curriculum_link || '',
            notes: candidate.notes || '',
            email: candidate.email || '',
            phone: candidate.phone || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja remover este candidato? Esta ação é irreversível.")) return;

        try {
            const { error } = await supabase
                .from('candidates')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchCandidates();
        } catch (error) {
            console.error("Error deleting candidate:", error);
            alert("Erro ao deletar candidato.");
        }
    };

    const handleDragStart = (e, candidate) => {
        setDraggingId(candidate.id);
        e.dataTransfer.effectAllowed = 'move';
        // Hack for Firefox support
        e.dataTransfer.setData('text/plain', candidate.id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        if (!draggingId) return;

        // Optimistic UI update
        const prevCandidates = [...candidates];
        setCandidates(prev => prev.map(c => c.id === draggingId ? { ...c, status: newStatus } : c));

        const targetId = draggingId;
        setDraggingId(null);

        try {
            const { error } = await supabase
                .from('candidates')
                .update({ status: newStatus })
                .eq('id', targetId);

            if (error) throw error;
        } catch (error) {
            console.error("Error updating candidate status via drag:", error);
            // Revert on failure
            setCandidates(prevCandidates);
        }
    };

    const handleCardClick = (candidate) => {
        setSelectedDetailCandidate(candidate);
    };

    if (isLoading) return <div className="loading-screen">Carregando CRM...</div>;

    const uniqueRoles = [...new Set(candidates.map(c => c.role))].filter(Boolean);
    const filteredCandidates = candidates.filter(c => {
        const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone?.includes(searchTerm);
        const matchesRole = filterRole ? c.role === filterRole : true;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="crm-container fade-in">
            <div className="crm-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0 }}>Pipeline de Vagas</h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                    <input
                        className="gamified-input"
                        placeholder="🔍 Buscar nome, e-mail ou telefone..."
                        style={{ minWidth: '220px', maxWidth: '350px', flex: 1, margin: 0, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="gamified-input"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        style={{ minWidth: '160px', width: 'auto', margin: 0, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    >
                        <option value="">Todas as Vagas</option>
                        {uniqueRoles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>

                    <Button variant="primary" onClick={() => {
                        setEditingCandidate(null);
                        setFormData({ name: '', role: '', status: 'Nova inscrição', curriculum_link: '', notes: '', email: '', phone: '' });
                        setShowForm(true);
                    }} style={{ whiteSpace: 'nowrap', margin: 0, padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        + Adicionar Candidato
                    </Button>
                </div>
            </div>

            <div className="kanban-board">
                {STATUS_COLUMNS.map(colStatus => (
                    <div
                        key={colStatus}
                        className="kanban-column glass-panel"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, colStatus)}
                    >
                        <div className="column-header">
                            <h3>{colStatus}</h3>
                            <span className="badge">{filteredCandidates.filter(c => c.status === colStatus).length}</span>
                        </div>

                        <div className="kanban-cards">
                            {filteredCandidates
                                .filter(c => c.status === colStatus)
                                .map(cand => (
                                    <div
                                        key={cand.id}
                                        className={`candidate-card ${draggingId === cand.id ? 'dragging' : ''}`}
                                        draggable="true"
                                        onDragStart={(e) => handleDragStart(e, cand)}
                                        onClick={() => handleCardClick(cand)}
                                    >
                                        <div className="card-top">
                                            <h4>{cand.name}</h4>
                                            <div className="card-actions">
                                                <button onClick={(e) => { e.stopPropagation(); handleEdit(cand); }} title="Editar">✏️</button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(cand.id); }} title="Excluir" style={{ color: 'var(--danger)' }}>🗑</button>
                                            </div>
                                        </div>
                                        <p className="cand-role">{cand.role}</p>

                                        {(cand.email || cand.phone) && (
                                            <div className="cand-contact">
                                                {cand.email && <div title="E-mail">✉️ {cand.email}</div>}
                                                {cand.phone && <div title="Telefone">📞 {cand.phone}</div>}
                                            </div>
                                        )}

                                        {cand.curriculum_link && (
                                            <a href={cand.curriculum_link} target="_blank" rel="noopener noreferrer" className="cv-link">
                                                Visualizar Currículo 📄
                                            </a>
                                        )}

                                        {cand.notes && (
                                            <div className="cand-notes" title={cand.notes}>
                                                {cand.notes.length > 60 ? cand.notes.substring(0, 60) + '...' : cand.notes}
                                            </div>
                                        )}

                                        <div className="cand-date">
                                            {new Date(cand.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {showForm && createPortal(
                <div className="rh-modal-overlay fade-in" onClick={() => setShowForm(false)}>
                    <div className="rh-modal-content scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <button className="rh-modal-close" onClick={() => setShowForm(false)}>✖</button>
                        <h2>{editingCandidate ? 'Editar Candidato' : 'Adicionar Novo Candidato'}</h2>

                        <form onSubmit={handleSave} className="crm-form">
                            <div className="form-group">
                                <label>Nome Completo *</label>
                                <input
                                    type="text"
                                    className="gamified-input"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Vaga / Cargo *</label>
                                <input
                                    type="text"
                                    className="gamified-input"
                                    required
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>E-mail</label>
                                    <input
                                        type="email"
                                        className="gamified-input"
                                        placeholder="candidato@email.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Telefone / WhatsApp</label>
                                    <input
                                        type="tel"
                                        className="gamified-input"
                                        placeholder="(11) 99999-9999"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Status no Processo</label>
                                <select
                                    className="gamified-input"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    {STATUS_COLUMNS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Link do Currículo (Drive/LinkedIn) - Opcional</label>
                                <input
                                    type="url"
                                    className="gamified-input"
                                    placeholder="https://..."
                                    value={formData.curriculum_link}
                                    onChange={e => setFormData({ ...formData, curriculum_link: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Anotações de Entrevista - Opcional</label>
                                <textarea
                                    className="gamified-input"
                                    rows="4"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>
                            </div>

                            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }}>
                                Salvar Candidato
                            </Button>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {selectedDetailCandidate && createPortal(
                <div className="rh-modal-overlay fade-in" onClick={() => setSelectedDetailCandidate(null)}>
                    <div className="rh-modal-content scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px' }}>
                        <button className="rh-modal-close" onClick={() => setSelectedDetailCandidate(null)}>✖</button>

                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '64px', height: '64px', background: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                                        {selectedDetailCandidate.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{selectedDetailCandidate.name}</h2>
                                        <p style={{ color: 'var(--primary-light)', margin: '0.2rem 0', fontWeight: 600 }}>{selectedDetailCandidate.role}</p>
                                    </div>
                                </div>

                                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Informações de Contato</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '1.2rem' }}>✉️</span>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>E-mail</p>
                                                <p style={{ margin: 0 }}>{selectedDetailCandidate.email || 'Não informado'}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '1.2rem' }}>📞</span>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Telefone / WhatsApp</p>
                                                <p style={{ margin: 0 }}>{selectedDetailCandidate.phone || 'Não informado'}</p>
                                            </div>
                                        </div>
                                        {selectedDetailCandidate.curriculum_link && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ fontSize: '1.2rem' }}>📄</span>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Currículo</p>
                                                    <a href={selectedDetailCandidate.curriculum_link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>Visualizar Documento Externo</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <div className="glass-panel" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        Anotações de RH
                                        <div className="badge" style={{ fontSize: '0.75rem' }}>{selectedDetailCandidate.status}</div>
                                    </h3>
                                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                        {selectedDetailCandidate.notes || 'Sem anotações registradas para este candidato.'}
                                    </div>
                                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                        <button className="rh-view-btn" onClick={() => { setSelectedDetailCandidate(null); handleEdit(selectedDetailCandidate); }}>
                                            Editar Ficha ✏️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Candidato registrado em: {new Date(selectedDetailCandidate.created_at).toLocaleDateString('pt-BR')} às {new Date(selectedDetailCandidate.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <Button variant="ghost" onClick={() => setSelectedDetailCandidate(null)}>Fechar Detalhes</Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default CandidatesCRM;
