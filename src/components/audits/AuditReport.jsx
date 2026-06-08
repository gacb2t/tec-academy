import React, { useState } from 'react';
import { auditService } from '../../services/auditService';
import './AuditReport.css';

const AuditReport = ({ audit, onBack }) => {
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackAuthor, setFeedbackAuthor] = useState('Gestor');
    const [feedbackText, setFeedbackText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // Trabalhamos com um clone local para atualizar a tela instantaneamente
    const [localAudit, setLocalAudit] = useState(audit);

    if (!localAudit || !localAudit.result) return null;

    const reportData = localAudit.result;

    const printReport = () => {
        window.print();
    };

    const handleSaveFeedback = async () => {
        if (!feedbackText.trim()) return;
        setIsSaving(true);
        
        try {
            const updatedResult = { ...reportData };
            if (!updatedResult.feedbacks) updatedResult.feedbacks = [];
            
            const newFeedback = {
                authorType: feedbackAuthor,
                text: feedbackText,
                date: new Date().toISOString()
            };
            
            updatedResult.feedbacks.push(newFeedback);
            
            await auditService.updateAuditResult(localAudit.id, { result: updatedResult });
            
            setLocalAudit({ ...localAudit, result: updatedResult });
            setShowFeedbackModal(false);
            setFeedbackText('');
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar feedback.");
        } finally {
            setIsSaving(false);
        }
    };

    // Helper para extrair a cor baseada na nota
    const getScoreColor = (nota) => {
        if (nota >= 8) return '#10b981'; // Verde
        if (nota >= 5) return '#f59e0b'; // Amarelo
        return '#ef4444'; // Vermelho
    };

    const criterios = reportData.criterios_vendedor || {};

    return (
        <div className="audit-report-container">
            {/* Header / Ações - Oculto na Impressão */}
            <div className="report-actions no-print">
                <button className="btn-secondary" onClick={onBack}>
                    &larr; Voltar
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-secondary" onClick={() => setShowFeedbackModal(true)}>
                        💬 Adicionar Feedback
                    </button>
                    <button className="btn-primary" onClick={printReport}>
                        🖨️ Imprimir / PDF
                    </button>
                </div>
            </div>

            {/* Documento A4 */}
            <div className="report-document">
                <div className="report-top-meta">
                    <span className="no-print">{new Date().toLocaleString('pt-BR')}</span>
                    <span>TEC-B2 Academy</span>
                </div>
                <div className="report-header">
                    <div className="report-branding">
                        <h2>TEC-B2</h2>
                        <span>RELATÓRIO DE AUDITORIA DE ATENDIMENTO</span>
                    </div>
                    <div className="report-meta">
                        <p><strong>Data da Ligação:</strong> {localAudit.call_date ? new Date(localAudit.call_date + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</p>
                        <p><strong>Telefone:</strong> {localAudit.client_phone || '-'}</p>
                        <p><strong>Vendedor(a):</strong> {localAudit.collaborator_name}</p>
                        <p><strong>Nota Geral:</strong> <span style={{ color: getScoreColor(reportData.nota_geral_vendedor), fontWeight: 'bold' }}>{reportData.nota_geral_vendedor}/10</span></p>
                    </div>
                </div>

                <div className="report-section">
                    <h3>👤 Análise do Perfil do Cliente</h3>
                    <div className="report-grid">
                        <div className="grid-item">
                            <strong>Dificuldade:</strong> {reportData.nivel_dificuldade_cliente}
                        </div>
                        <div className="grid-item">
                            <strong>Interesse Inicial:</strong> {reportData.interesse_inicial_cliente}
                        </div>
                        <div className="grid-item">
                            <strong>Perfil Decisor:</strong> {reportData.analise_cliente?.perfil_decisor}
                        </div>
                        <div className="grid-item">
                            <strong>Provedor Atual:</strong> {reportData.analise_cliente?.provedor_atual}
                        </div>
                    </div>
                    <p className="mt-2"><strong>Perfil do Cliente:</strong> {reportData.perfil_cliente}</p>
                    <p><strong>Resistência Apresentada:</strong> {reportData.analise_cliente?.resistencia}</p>
                    <p><strong>Comportamento:</strong> {reportData.analise_cliente?.comportamento}</p>
                </div>

                <div className="report-section">
                    <h3>🚧 Objeções e Barreiras</h3>
                    <ul>
                        {(reportData.tipo_objecoes || []).map((obj, idx) => (
                            <li key={idx}>{obj}</li>
                        ))}
                    </ul>
                    <p><strong>Principais Preocupações:</strong> {reportData.analise_cliente?.principais_preocupacoes}</p>
                </div>

                <div className="report-section">
                    <h3>🛠 Avaliação por Etapas do Atendimento</h3>
                    <div className="criterios-list">
                        {Object.entries(criterios).map(([key, value]) => (
                            <div key={key} className="criterio-card">
                                <h4>
                                    {key.replace(/_/g, ' ').toUpperCase()} 
                                    <span className="nota-badge" style={{ backgroundColor: getScoreColor(value.nota) }}>
                                        {value.nota}
                                    </span>
                                </h4>
                                <p>{value.comentario}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="report-section">
                    <h3>🧠 Visão Geral Estratégica</h3>
                    <p>{reportData.resumo_estrategico}</p>
                    
                    <div className="split-columns">
                        <div className="column strong-points">
                            <h4>⭐ Pontos Fortes</h4>
                            <p>{reportData.pontos_fortes_vendedor}</p>
                        </div>
                        <div className="column weak-points">
                            <h4>📈 Pontos de Melhoria</h4>
                            <p>{reportData.pontos_melhoria_vendedor}</p>
                        </div>
                    </div>
                </div>

                {reportData.pontos_de_atencao && reportData.pontos_de_atencao.length > 0 && (
                    <div className="report-section alerts-section">
                        <h3>⚠️ Pontos de Atenção (Violações e Contexto)</h3>
                        <ul>
                            {reportData.pontos_de_atencao.map((p, idx) => (
                                <li key={idx}>{p.ponto}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {reportData.cursos_de_reforco && reportData.cursos_de_reforco.length > 0 && (
                    <div className="report-section courses-section">
                        <h3>📚 Cursos de Reforço Recomendados</h3>
                        <ul>
                            {reportData.cursos_de_reforco.map((c, idx) => (
                                <li key={idx}>{c.curso}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Bloco de Feedbacks */}
                {reportData.feedbacks && reportData.feedbacks.length > 0 && (
                    <div className="report-section feedbacks-section">
                        <h3>💬 Feedbacks</h3>
                        <div className="feedbacks-list">
                            {reportData.feedbacks.map((fb, idx) => (
                                <div key={idx} className="feedback-card">
                                    <div className="feedback-header">
                                        <strong>{fb.authorType}</strong>
                                        <span>{new Date(fb.date).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <p>{fb.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                <div className="report-section">
                    <h3>📝 Transcrição da Ligação</h3>
                    <div className="transcript-box">
                        {reportData.transcricao_formatada.split('\n').map((line, idx) => {
                            if (!line.trim()) return <br key={idx} />;
                            let lineClass = 'transcript-line';
                            if (line.toLowerCase().startsWith('vendedor') || line.toLowerCase().startsWith('atendente')) {
                                lineClass += ' line-seller';
                            } else if (line.toLowerCase().startsWith('cliente')) {
                                lineClass += ' line-client';
                            }
                            return <p key={idx} className={lineClass}>{line}</p>;
                        })}
                    </div>
                </div>

                {/* Bloco de Áudio */}
                {localAudit.audio_url && (
                    <div className="report-section audio-section">
                        <h3>🎧 Gravação Original</h3>
                        <div className="no-print" style={{ marginTop: '1rem' }}>
                            <audio controls src={localAudit.audio_url} style={{ width: '100%' }}>
                                Seu navegador não suporta o elemento de áudio.
                            </audio>
                        </div>
                        <div className="only-print" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666', wordBreak: 'break-all' }}>
                            <strong>URL da Gravação:</strong> {localAudit.audio_url}
                        </div>
                    </div>
                )}

                <div className="report-footer">
                    <p>Auditoria gerada pela TEC-B2 AI Academy</p>
                </div>
            </div>

            {/* Modal de Feedback */}
            {showFeedbackModal && (
                <div className="audit-modal-overlay no-print">
                    <div className="audit-modal">
                        <div className="audit-modal-header">
                            <h3>Adicionar Feedback</h3>
                            <button className="audit-modal-close" onClick={() => setShowFeedbackModal(false)}>&times;</button>
                        </div>
                        <div className="audit-modal-body">
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Autor do Feedback</label>
                                <select 
                                    className="department-select" 
                                    style={{ width: '100%' }}
                                    value={feedbackAuthor}
                                    onChange={(e) => setFeedbackAuthor(e.target.value)}
                                >
                                    <option value="Gestor">Gestor</option>
                                    <option value="Recursos Humanos">Recursos Humanos</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Comentário</label>
                                <textarea 
                                    className="member-search-input" 
                                    style={{ width: '100%', minHeight: '120px', resize: 'vertical' }}
                                    placeholder="Escreva seu feedback detalhado aqui..."
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="audit-modal-footer">
                            <button className="btn-secondary" onClick={() => setShowFeedbackModal(false)}>Cancelar</button>
                            <button className="audits-btn-primary" onClick={handleSaveFeedback} disabled={isSaving || !feedbackText.trim()}>
                                {isSaving ? 'Salvando...' : 'Salvar Feedback'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditReport;
