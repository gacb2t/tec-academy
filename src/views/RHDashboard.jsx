import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../services/supabaseClient';
import './RHDashboard.css';

// ─────────────────────────────────────────
// Formatador de data
// ─────────────────────────────────────────
const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
};

// ─────────────────────────────────────────
// Linha de curso expandida dentro do card de usuário
// ─────────────────────────────────────────
const CursoRow = ({ curso }) => {
    const [showRespostas, setShowRespostas] = useState(false);
    const [respostas, setRespostas] = useState(null);
    const [loadingResp, setLoadingResp] = useState(false);

    const aprovado = (curso.percentage || 0) >= 90;
    const pct = curso.percentage || 0;
    const fillClass = pct >= 90 ? 'high' : pct >= 60 ? '' : 'low';

    const handleToggleRespostas = async () => {
        if (showRespostas) { setShowRespostas(false); return; }
        setShowRespostas(true);
        if (respostas !== null) return; // já carregou
        setLoadingResp(true);
        try {
            const { data, error } = await supabase
                .from('course_answers')
                .select('*')
                .eq('progress_id', curso.id)
                .order('id', { ascending: true });
            if (error) throw error;
            setRespostas(data || []);
        } catch {
            setRespostas([]);
        } finally {
            setLoadingResp(false);
        }
    };

    const groupedAnswers = useMemo(() => {
        if (!respostas) return [];
        const groupMap = new Map();
        
        respostas.forEach(resp => {
            if (!groupMap.has(resp.question_text)) {
                groupMap.set(resp.question_text, {
                    question_text: resp.question_text,
                    attempts: 0,
                    final_correct: false,
                    history: []
                });
            }
            const group = groupMap.get(resp.question_text);
            group.attempts += 1;
            group.history.push({ text: resp.answer_text, isCorrect: resp.is_correct });
            group.final_correct = resp.is_correct; // assume a última resposta é a definitiva
        });

        return Array.from(groupMap.values());
    }, [respostas]);

    const tentativas = curso.attempts_count || 1;

    return (
        <div className={`curso-row ${aprovado ? 'curso-row-ok' : 'curso-row-fail'}`}>
            {/* Linha principal */}
            <div className="curso-row-main">

                {/* Célula CURSO: ícone + nome juntos no mesmo slot do grid */}
                <div className="curso-row-curso">
                    <span className="curso-row-icon">{curso.courseIcon}</span>
                    <div className="curso-row-info">
                        <span className="curso-row-title" title={curso.courseTitle}>
                            {curso.courseTitle}
                        </span>
                        <span className="curso-row-date">📅 {formatDate(curso.completed_at)}</span>
                    </div>
                </div>

                {/* Célula TENTATIVAS */}
                <div className="curso-row-attempts" title={`${tentativas} tentativa${tentativas !== 1 ? 's' : ''}`}>
                    <span className="attempts-icon">🔁</span>
                    <span className="attempts-count">{tentativas}x</span>
                </div>

                {/* Célula PONTUAÇÃO */}
                <div className="curso-row-score">
                    {curso.score ?? '—'} / {curso.total_questions ?? '—'}
                </div>

                {/* Célula PERCENTUAL */}
                <div className="curso-row-pct">
                    <div className="mini-progress">
                        <div className={`mini-progress-fill ${fillClass}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="pct-label">{pct}%</span>
                </div>

                {/* Célula STATUS */}
                <span className={`approval-badge ${aprovado ? 'approved' : 'failed'}`}>
                    {aprovado ? '✅ Aprovado' : '❌ Reprovado'}
                </span>

                {/* Célula AÇÕES */}
                <button className="btn-answers-toggle" onClick={handleToggleRespostas}>
                    {showRespostas ? '▲ Ocultar' : '▼ Respostas'}
                </button>
            </div>

            {/* Respostas detalhadas */}
            {showRespostas && (
                <div className="curso-row-answers">
                    {loadingResp ? (
                        <div className="rh-loading" style={{ padding: '1rem' }}>
                            <div className="rh-spinner" />
                        </div>
                    ) : !respostas || groupedAnswers.length === 0 ? (
                        <p className="answers-empty">Respostas individuais não disponíveis para este registro.</p>
                    ) : (
                        groupedAnswers.map((group, i) => (
                            <div
                                key={i}
                                className={`answer-item ${group.final_correct ? 'answer-correct' : 'answer-wrong'}`}
                                style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem' }}
                            >
                                <div className="answer-question" style={{ width: '100%', fontWeight: '600', marginBottom: '0.25rem' }}>
                                    {i + 1}. {group.question_text}
                                </div>
                                <div className="answer-response" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ fontWeight: '500', color: group.final_correct ? 'var(--accent)' : 'var(--danger)' }}>
                                        {group.final_correct ? '✅ Acertou' : '❌ Errou'} {group.attempts > 1 ? `após ${group.attempts} tentativas` : 'na primeira tentativa'}
                                    </span>
                                    
                                    {group.attempts > 1 && (
                                        <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.25rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                                            <div style={{ marginBottom: '4px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Histórico de opções enviadas:</div>
                                            {group.history.map((h, k) => (
                                                <div key={k} style={{ marginBottom: '2px' }}>
                                                    <span style={{ opacity: 0.7 }}>{k + 1}ª vez:</span> {h.isCorrect ? '✅' : '❌'} {h.text}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {group.attempts === 1 && (
                                        <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.25rem' }}>
                                            <span>Resposta escolhida:</span> {group.history[0].text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────
// Card de usuário (expansível)
// ─────────────────────────────────────────
const UserCard = ({ user }) => {
    const [expanded, setExpanded] = useState(false);

    const totalCursos = user.cursos.length;
    const aprovados = user.cursos.filter(c => (c.percentage || 0) >= 90).length;
    const media = totalCursos
        ? Math.round(user.cursos.reduce((a, c) => a + (c.percentage || 0), 0) / totalCursos)
        : 0;

    const initial = (user.userName || 'U')[0].toUpperCase();
    const mediaColor = media >= 90 ? 'var(--accent)' : media >= 60 ? 'var(--warning, #FFBE0B)' : 'var(--danger)';

    return (
        <div className={`user-card ${expanded ? 'user-card-open' : ''}`}>
            {/* Cabeçalho do card (clicável) */}
            <div className="user-card-header" onClick={() => setExpanded(!expanded)}>
                {/* Avatar com inicial */}
                <div className="user-avatar">{initial}</div>

                {/* Info do usuário */}
                <div className="user-card-info">
                    <span className="user-card-name">{user.userName}</span>
                    <span className="user-card-email">{user.userEmail}</span>
                </div>

                {/* Dept badge */}
                <span className="dept-badge">{user.userDept}</span>

                {/* Mini-stats inline */}
                <div className="user-card-stats">
                    <div className="user-mini-stat">
                        <span className="user-mini-val">{totalCursos}</span>
                        <span className="user-mini-lbl">Cursos</span>
                    </div>
                    <div className="user-mini-stat">
                        <span className="user-mini-val" style={{ color: 'var(--accent)' }}>{aprovados}</span>
                        <span className="user-mini-lbl">Aprovados</span>
                    </div>
                    <div className="user-mini-stat">
                        <span className="user-mini-val" style={{ color: mediaColor }}>{media}%</span>
                        <span className="user-mini-lbl">Média</span>
                    </div>
                </div>

                {/* Chevron */}
                <span className={`user-card-chevron ${expanded ? 'open' : ''}`}>›</span>
            </div>

            {/* Cursos expandidos */}
            {expanded && (
                <div className="user-card-body">
                    {/* Cabeçalho das colunas */}
                    <div className="cursos-header">
                        <span>Curso</span>
                        <span>Tentativas</span>
                        <span>Pontuação</span>
                        <span>Percentual</span>
                        <span>Status</span>
                        <span></span>
                    </div>
                    {user.cursos.map(c => (
                        <CursoRow key={c.id} curso={c} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────
// Sub-aba: Resultados dos Cursos
// ─────────────────────────────────────────
const ResultadosCursos = () => {
    const [resultados, setResultados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeDept, setActiveDept] = useState('Todos');
    const [busca, setBusca] = useState('');

    // Busca todos os dados
    const fetchResultados = useCallback(async () => {
        setIsLoading(true);
        try {
            const [{ data: progressos, error: progErr }, { data: perfis, error: perfErr }, { data: cursosData, error: curErr }] =
                await Promise.all([
                    supabase.from('course_progress').select('*').order('completed_at', { ascending: false }),
                    supabase.from('user_profiles').select('user_id, name, email, department'),
                    supabase.from('courses').select('id, title, icon'),
                ]);
            if (progErr) throw progErr;
            if (perfErr) throw perfErr;
            if (curErr) throw curErr;

            const perfilMap = {};
            (perfis || []).forEach(p => { perfilMap[p.user_id] = p; });
            const cursoMap = {};
            (cursosData || []).forEach(c => { cursoMap[c.id] = c; });

            const merged = [];
            (progressos || []).forEach(prog => {
                const cursoEncontrado = cursoMap[prog.course_id];
                // Remover cursos fantasmas/antigos que não existem mais mapeados
                if (!cursoEncontrado) return;

                merged.push({
                    ...prog,
                    userName: perfilMap[prog.user_id]?.name || 'Usuário',
                    userEmail: perfilMap[prog.user_id]?.email || prog.user_id,
                    userDept: perfilMap[prog.user_id]?.department || '—',
                    courseTitle: cursoEncontrado.title || prog.course_id,
                    courseIcon: cursoEncontrado.icon || '📘',
                });
            });

            setResultados(merged);
        } catch (err) {
            console.error('Erro ao carregar resultados RH:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchResultados(); }, [fetchResultados]);

    // Departamentos com dados reais
    const departamentosComDados = useMemo(() => {
        const depts = [...new Set(resultados.map(r => r.userDept).filter(d => d && d !== '—'))].sort();
        return depts;
    }, [resultados]);

    // Agrupa por usuário (filtrado pelo departamento ativo e busca)
    const usuariosAgrupados = useMemo(() => {
        const filtrados = resultados.filter(r => {
            if (activeDept !== 'Todos' && r.userDept !== activeDept) return false;
            if (busca) {
                const q = busca.toLowerCase();
                return r.userName.toLowerCase().includes(q) || r.userEmail.toLowerCase().includes(q);
            }
            return true;
        });

        const map = {};
        filtrados.forEach(r => {
            if (!map[r.user_id]) {
                map[r.user_id] = {
                    user_id: r.user_id,
                    userName: r.userName,
                    userEmail: r.userEmail,
                    userDept: r.userDept,
                    cursos: [],
                };
            }
            map[r.user_id].cursos.push(r);
        });

        return Object.values(map);
    }, [resultados, activeDept, busca]);

    // Stats globais (sempre sobre tudo, não filtrado)
    const totalAttempts = resultados.length;
    const totalUsers = useMemo(() => new Set(resultados.map(r => r.user_id)).size, [resultados]);
    const totalAprovados = resultados.filter(r => (r.percentage || 0) >= 90).length;
    const mediaGeral = totalAttempts
        ? Math.round(resultados.reduce((a, r) => a + (r.percentage || 0), 0) / totalAttempts)
        : 0;

    if (isLoading) {
        return (
            <div className="rh-loading">
                <div className="rh-spinner" />
                <span>Carregando resultados...</span>
            </div>
        );
    }

    return (
        <div>
            {/* Stats globais */}
            <div className="rh-stats-bar">
                <div className="rh-stat-card">
                    <span className="rh-stat-value">{totalUsers}</span>
                    <span className="rh-stat-label">Colaboradores</span>
                </div>
                <div className="rh-stat-card">
                    <span className="rh-stat-value">{totalAttempts}</span>
                    <span className="rh-stat-label">Conclusões Totais</span>
                </div>
                <div className="rh-stat-card">
                    <span className="rh-stat-value" style={{ color: 'var(--accent)' }}>{totalAprovados}</span>
                    <span className="rh-stat-label">Aprovações (≥90%)</span>
                </div>
                <div className="rh-stat-card">
                    <span className="rh-stat-value">{mediaGeral}%</span>
                    <span className="rh-stat-label">Média Geral</span>
                </div>
            </div>

            {/* Busca */}
            <div className="rh-filters">
                <input
                    className="rh-search-input"
                    type="text"
                    placeholder="🔍 Buscar colaborador por nome ou e-mail..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                />
            </div>

            {/* Abas de departamento */}
            <div className="dept-tabs">
                <button
                    className={`dept-tab-btn ${activeDept === 'Todos' ? 'active' : ''}`}
                    onClick={() => setActiveDept('Todos')}
                >
                    Todos
                    <span className="dept-tab-count">
                        {new Set(resultados.map(r => r.user_id)).size}
                    </span>
                </button>
                {departamentosComDados.map(dept => {
                    const count = new Set(resultados.filter(r => r.userDept === dept).map(r => r.user_id)).size;
                    return (
                        <button
                            key={dept}
                            className={`dept-tab-btn ${activeDept === dept ? 'active' : ''}`}
                            onClick={() => setActiveDept(dept)}
                        >
                            {dept}
                            <span className="dept-tab-count">{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Lista de usuários */}
            {usuariosAgrupados.length === 0 ? (
                <div className="rh-empty">
                    {resultados.length === 0
                        ? '📭 Nenhum resultado registrado ainda.'
                        : '🔍 Nenhum colaborador encontrado com os filtros aplicados.'}
                </div>
            ) : (
                <div className="users-list">
                    {usuariosAgrupados.map(user => (
                        <UserCard key={user.user_id} user={user} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────
// Sub-aba: CRM de Inscrições
// ─────────────────────────────────────────
const CRMInscricoes = () => {
    const [inscricoes, setInscricoes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [busca, setBusca] = useState('');

    useEffect(() => {
        const fetchInscricoes = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('colab_requests')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setInscricoes(data || []);
            } catch (err) {
                console.warn('Tabela colab_requests não encontrada ou erro:', err.message);
                setInscricoes([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInscricoes();
    }, []);

    const inscricoesFiltradas = inscricoes.filter(i => {
        if (!busca) return true;
        const q = busca.toLowerCase();
        return (
            (i.first_name || '').toLowerCase().includes(q) ||
            (i.last_name || '').toLowerCase().includes(q) ||
            (i.requested_email || '').toLowerCase().includes(q)
        );
    });

    if (isLoading) {
        return (
            <div className="rh-loading">
                <div className="rh-spinner" />
                <span>Carregando inscrições...</span>
            </div>
        );
    }

    return (
        <div>
            <div className="rh-stats-bar">
                <div className="rh-stat-card">
                    <span className="rh-stat-value">{inscricoes.length}</span>
                    <span className="rh-stat-label">Total de Solicitações</span>
                </div>
                <div className="rh-stat-card">
                    <span className="rh-stat-value" style={{ color: 'var(--warning, #FFBE0B)' }}>
                        {inscricoes.filter(i => i.status === 'pending' || !i.status).length}
                    </span>
                    <span className="rh-stat-label">Pendentes</span>
                </div>
                <div className="rh-stat-card">
                    <span className="rh-stat-value" style={{ color: 'var(--accent)' }}>
                        {inscricoes.filter(i => i.status === 'done').length}
                    </span>
                    <span className="rh-stat-label">Concluídas</span>
                </div>
            </div>

            <div className="rh-filters">
                <input
                    className="rh-search-input"
                    type="text"
                    placeholder="🔍 Buscar por nome ou e-mail solicitado..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                />
            </div>

            {inscricoesFiltradas.length === 0 ? (
                <div className="crm-empty">
                    <div className="crm-empty-icon">📬</div>
                    {inscricoes.length === 0 ? (
                        <>
                            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                                Nenhuma solicitação de e-mail corporativo registrada ainda.
                            </p>
                            <p style={{ fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto' }}>
                                Quando um novo colaborador preencher o formulário de solicitação
                                de e-mail no curso de Onboarding, as informações aparecerão aqui.
                            </p>
                        </>
                    ) : (
                        <p>Nenhuma solicitação encontrada para a busca realizada.</p>
                    )}
                </div>
            ) : (
                inscricoesFiltradas.map(insc => {
                    const isDone = insc.status === 'done';
                    const nome = `${insc.first_name || ''} ${insc.last_name || ''}`.trim();
                    return (
                        <div key={insc.id} className="crm-card">
                            <div className="crm-card-left">
                                <span className="crm-card-name">{nome || '—'}</span>
                                <span className="crm-card-email">{insc.requested_email || '—'}</span>
                                <span className="crm-card-date">📅 {formatDate(insc.created_at)}</span>
                            </div>
                            <span className={`crm-status-badge ${isDone ? 'done' : 'pending'}`}>
                                {isDone ? '✅ Concluído' : '⏳ Pendente'}
                            </span>
                        </div>
                    );
                })
            )}
        </div>
    );
};

// ─────────────────────────────────────────
// Componente principal: RH Dashboard
// ─────────────────────────────────────────
const RHDashboard = ({ userDepartment }) => {
    const [activeTab, setActiveTab] = useState('resultados');

    return (
        <div className="rh-dashboard fade-in">
            <div className="rh-header">
                <div className="rh-header-left">
                    <h1>Painel de Recursos Humanos</h1>
                    <p>Acompanhe resultados acadêmicos e inscrições dos colaboradores.</p>
                </div>
                <span className="rh-badge">👥 Acesso RH</span>
            </div>

            <div className="rh-tabs">
                <button
                    className={`rh-tab-btn ${activeTab === 'resultados' ? 'active' : ''}`}
                    onClick={() => setActiveTab('resultados')}
                >
                    📊 Resultados dos Cursos
                </button>
                <button
                    className={`rh-tab-btn ${activeTab === 'inscricoes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inscricoes')}
                >
                    📬 CRM de Inscrições
                </button>
            </div>

            {activeTab === 'resultados' && <ResultadosCursos />}
            {activeTab === 'inscricoes' && <CRMInscricoes />}
        </div>
    );
};

export default RHDashboard;
