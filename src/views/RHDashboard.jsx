import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../services/supabaseClient';
import './RHDashboard.css';
import CandidatesCRM from '../components/CandidatesCRM';

const RHDashboard = () => {
    const [activeTab, setActiveTab] = useState('colaboradores');
    const [stats, setStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);
    const [coursesMap, setCoursesMap] = useState({});
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [completionHistory, setCompletionHistory] = useState([]);
    const [selectedExecutionId, setSelectedExecutionId] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');

    useEffect(() => {
        const fetchRHStats = async () => {
            try {
                const { data: coursesData, error: coursesErr } = await supabase.from('courses').select('id, title, icon, thumbnail');
                if (coursesErr) throw coursesErr;

                const cMap = {};
                coursesData.forEach(c => cMap[c.id] = c);
                setCoursesMap(cMap);

                const { data: profiles, error: profErr } = await supabase.from('user_profiles').select('user_id, name, department, email');
                if (profErr) throw profErr;

                const { data: progressList, error: progErr } = await supabase.from('course_progress').select('user_id, course_id, percentage, score, total_questions, id');
                if (progErr) throw progErr;

                const deptMap = {};

                for (const profile of profiles || []) {
                    const dept = profile.department || 'Sem Setor';
                    if (!deptMap[dept]) deptMap[dept] = [];

                    const userProgresses = progressList.filter(p => p.user_id === profile.user_id);
                    const completedCoursesCount = userProgresses.filter(p => p.percentage >= 90).length;

                    let totalScore = 0;
                    let totalPossible = 0;
                    userProgresses.forEach(p => {
                        totalScore += p.score || 0;
                        totalPossible += p.total_questions || 0;
                    });

                    const avgScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

                    deptMap[dept].push({
                        ...profile,
                        completedCount: completedCoursesCount,
                        avgScore,
                        progressList: userProgresses
                    });
                }

                setStats(deptMap);
            } catch (error) {
                console.error("Failed to load RH stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRHStats();
    }, []);

    const handleViewDetails = async (userObj) => {
        setSelectedUser(userObj);
        setIsLoadingAnswers(true);
        setUserAnswers([]);
        setCompletionHistory([]);
        setSelectedCourseId(null);
        setSelectedExecutionId(null);

        try {
            const { data: freshProgress } = await supabase
                .from('course_progress')
                .select('id, course_id, score, total_questions, percentage')
                .eq('user_id', userObj.user_id);

            // Fetch completion history including answers jsonb (newest first)
            const { data: historyData } = await supabase
                .from('course_completion_history')
                .select('id, course_id, score, total_questions, percentage, completed_at, answers')
                .eq('user_id', userObj.user_id)
                .order('completed_at', { ascending: false });

            setCompletionHistory(historyData || []);

            const progressIds = (freshProgress || []).map(p => p.id);
            if (progressIds.length === 0) return;

            const { data: answers, error } = await supabase
                .from('course_answers')
                .select(`*, course_progress!inner(course_id)`)
                .in('progress_id', progressIds);

            if (error) throw error;

            const enrichedAnswers = answers?.map(a => ({
                ...a,
                courseName: coursesMap[a.course_progress?.course_id]?.title || 'Curso Desconhecido',
                courseId: a.course_progress?.course_id
            })) || [];

            setUserAnswers(enrichedAnswers);
        } catch (error) {
            console.error("Failed to fetch answers:", error);
        } finally {
            setIsLoadingAnswers(false);
        }
    };

    if (isLoading) {
        return <div className="loading-screen">Carregando métricas de RH...</div>;
    }

    const filteredStats = {};
    Object.keys(stats).forEach(dept => {
        if (filterDept && dept !== filterDept) return;

        const filteredUsers = stats[dept].filter(u =>
            u.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredUsers.length > 0) {
            filteredStats[dept] = filteredUsers;
        }
    });

    return (
        <div className="rh-dashboard fade-in">
            <div className="rh-header-section" style={{ marginBottom: '2rem' }}>
                <div className="hero-text">
                    <h1 style={{ border: 'none', margin: 0 }}>Métricas Corporativas (RH) 📊</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Acompanhe o engajamento e a evolução das equipes da TEC-B2 em tempo real.</p>
                </div>

                <div className="rh-tabs">
                    <button
                        className={`rh-tab-btn ${activeTab === 'colaboradores' ? 'active' : ''}`}
                        onClick={() => setActiveTab('colaboradores')}
                    >
                        👥 Colaboradores
                    </button>
                    <button
                        className={`rh-tab-btn ${activeTab === 'candidatos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('candidatos')}
                    >
                        📝 Candidatos (Novo!)
                    </button>
                </div>
            </div>

            {activeTab === 'candidatos' ? (
                <CandidatesCRM />
            ) : (
                <>
                    <div className="rh-filters glass-panel" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            className="gamified-input"
                            placeholder="Buscar colaborador por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ flex: 1, minWidth: '250px' }}
                        />
                        <select
                            className="gamified-input"
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                            style={{ minWidth: '250px', width: 'auto' }}
                        >
                            <option value="">Todos os Departamentos</option>
                            {Object.keys(stats).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    {Object.keys(filteredStats).length === 0 ? (
                        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
                            Nenhum dado encontrado com os filtros atuais.
                        </div>
                    ) : (
                        <div className="rh-departments-grid">
                            {Object.keys(filteredStats).map(dept => (
                                <div key={dept} className="rh-department glass-panel">
                                    <h2 className="rh-dept-title">{dept}</h2>
                                    <div className="rh-users-list">
                                        {filteredStats[dept].length === 0 && <p style={{ color: 'var(--text-secondary)' }}>Sem usuários</p>}
                                        {filteredStats[dept].map(u => (
                                            <div key={u.user_id} className="rh-user-card">
                                                <div className="rh-user-info">
                                                    <h4>{u.name || 'Usuário Sem Nome'}</h4>
                                                    <p>Cursos Concluídos: <strong>{u.completedCount}</strong></p>
                                                    <p>Taxa de Acertos Geral: <span style={{ color: u.avgScore >= 90 ? 'var(--success)' : 'var(--warning)' }}>{u.avgScore}%</span></p>
                                                </div>
                                                <button className="rh-view-btn" onClick={() => handleViewDetails(u)}>
                                                    Ver Detalhes 👀
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {selectedUser && createPortal(
                <div className="rh-modal-overlay fade-in" onClick={() => { setSelectedUser(null); setSelectedCourseId(null); }}>
                    <div className="rh-modal-content scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
                        <button className="rh-modal-close" onClick={() => { setSelectedUser(null); setSelectedCourseId(null); }}>✖</button>
                        <h2>Detalhes Analíticos: {selectedUser.name}</h2>

                        {/* User summary stats */}
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', margin: '0 0 5px 0' }}>Setor</p>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{selectedUser.department}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', margin: '0 0 5px 0' }}>Email</p>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{selectedUser.email || 'Não informado'}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', margin: '0 0 5px 0' }}>Cursos Feitos</p>
                                <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--primary-light)' }}>{selectedUser.completedCount}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', margin: '0 0 5px 0' }}>Taxa Acadêmica</p>
                                <p style={{ margin: 0, fontWeight: 'bold', color: selectedUser.avgScore >= 90 ? 'var(--success)' : 'var(--warning)' }}>{selectedUser.avgScore}%</p>
                            </div>
                        </div>

                        {/* Completion history section */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Treinamentos Concluídos</h3>

                            {(() => {
                                const courseIds = [...new Set(completionHistory.map(h => h.course_id))];
                                if (courseIds.length === 0) {
                                    return <p style={{ color: 'var(--text-secondary)' }}>Nenhum treinamento finalizado ainda.</p>;
                                }
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {courseIds.filter(id => coursesMap[id]).map(courseId => {
                                            const cData = coursesMap[courseId];
                                            const executions = completionHistory.filter(h => h.course_id === courseId);
                                            const isCardOpen = selectedCourseId === courseId;
                                            return (
                                                <div key={courseId}
                                                    onClick={() => {
                                                        setSelectedCourseId(isCardOpen ? null : courseId);
                                                        setSelectedExecutionId(null);
                                                    }}
                                                    style={{
                                                        padding: '1rem',
                                                        background: isCardOpen ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
                                                        borderRadius: '12px',
                                                        cursor: 'pointer',
                                                        border: isCardOpen ? '1px solid var(--primary-light)' : '1px solid rgba(255,255,255,0.1)',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    {/* Course card header — always visible */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{ fontSize: '1.5rem' }}>{cData?.icon || cData?.thumbnail || '📚'}</span>
                                                        <div>
                                                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{cData?.title}</div>
                                                            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                                                                {executions.length} execução{executions.length !== 1 ? 'ões' : ''} — clique para ver datas
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Execution date rows — only appear when card is open */}
                                                    {isCardOpen && (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.75rem' }}>
                                                            {executions.map(ex => {
                                                                const dt = new Date(ex.completed_at);
                                                                const label = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                                                const time = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                                                const isExSelected = selectedExecutionId === ex.id;
                                                                const hasAnswers = Array.isArray(ex.answers) && ex.answers.length > 0;
                                                                return (
                                                                    <div key={ex.id}>
                                                                        {/* Clickable date row */}
                                                                        <div
                                                                            onClick={e => {
                                                                                e.stopPropagation();
                                                                                if (hasAnswers) setSelectedExecutionId(isExSelected ? null : ex.id);
                                                                            }}
                                                                            style={{
                                                                                display: 'flex',
                                                                                justifyContent: 'space-between',
                                                                                fontSize: '0.82rem',
                                                                                padding: '0.4rem 0.6rem',
                                                                                borderRadius: '6px',
                                                                                cursor: hasAnswers ? 'pointer' : 'default',
                                                                                background: isExSelected ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.03)',
                                                                                transition: 'background 0.15s',
                                                                                marginBottom: '2px'
                                                                            }}
                                                                        >
                                                                            <span style={{ color: hasAnswers ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                                                                📅 {label} às {time}{hasAnswers ? ' 🔍' : ''}
                                                                            </span>
                                                                            <span style={{ color: ex.percentage >= 90 ? 'var(--success)' : 'var(--warning)', fontWeight: 'bold' }}>
                                                                                {ex.score}/{ex.total_questions} ({ex.percentage}%)
                                                                            </span>
                                                                        </div>

                                                                        {/* Inline answers table for this execution */}
                                                                        {isExSelected && hasAnswers && (
                                                                            <div className="rh-answers-table-wrapper fade-in" style={{ marginTop: '0.4rem', marginBottom: '0.6rem' }}>
                                                                                <table className="rh-answers-table">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>Questão</th>
                                                                                            <th>Resposta</th>
                                                                                            <th>Resultado</th>
                                                                                            <th>Tentativas</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {ex.answers.map((ans, i) => (
                                                                                            <tr key={i}>
                                                                                                <td title={ans.question}>{ans.question?.substring(0, 60)}{ans.question?.length > 60 ? '...' : ''}</td>
                                                                                                <td title={ans.answer}>{ans.answer?.substring(0, 45)}{ans.answer?.length > 45 ? '...' : ''}</td>
                                                                                                <td style={{ color: ans.correct ? 'var(--success)' : 'var(--danger)' }}>
                                                                                                    {ans.correct ? '✅ Sim' : '❌ Não'}
                                                                                                </td>
                                                                                                <td style={{ fontWeight: 'bold', textAlign: 'center' }}>{ans.attempts || 1}x</td>
                                                                                            </tr>
                                                                                        ))}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default RHDashboard;
