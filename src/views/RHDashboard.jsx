import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../services/supabaseClient';
import './RHDashboard.css';
import CandidatesCRM from '../components/CandidatesCRM';

const RHDashboard = () => {
    const [activeTab, setActiveTab] = useState('colaboradores'); // colaboradores, candidatos
    const [stats, setStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);
    const [coursesMap, setCoursesMap] = useState({});
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');

    useEffect(() => {
        const fetchRHStats = async () => {
            try {
                // Fetch all courses to build a map including titles and icons
                const { data: coursesData, error: coursesErr } = await supabase.from('courses').select('id, title, icon, thumbnail');
                if (coursesErr) throw coursesErr;

                const cMap = {};
                coursesData.forEach(c => cMap[c.id] = c);
                setCoursesMap(cMap);

                // Fetch user profiles to know departments and emails
                const { data: profiles, error: profErr } = await supabase.from('user_profiles').select('user_id, name, department, email');
                if (profErr) throw profErr;

                // Fetch course progress
                const { data: progressList, error: progErr } = await supabase.from('course_progress').select('user_id, course_id, percentage, score, total_questions, id');
                if (progErr) throw progErr;

                // Aggregate stats by Department -> User
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

        try {
            // Re-fetch progress live from DB to get the latest data (avoid stale cache)
            const { data: freshProgress } = await supabase
                .from('course_progress')
                .select('id, course_id, score, total_questions, percentage')
                .eq('user_id', userObj.user_id);

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

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Treinamentos Concluídos</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {selectedUser.progressList.filter(p => p.percentage >= 90 && coursesMap[p.course_id]).length === 0 ? (
                                    <p style={{ color: 'var(--text-secondary)' }}>Nenhum treinamento finalizado ainda.</p>
                                ) : (
                                    selectedUser.progressList.filter(p => p.percentage >= 90 && coursesMap[p.course_id]).map(p => {
                                        const cData = coursesMap[p.course_id];
                                        const isSelected = selectedCourseId === p.course_id;
                                        return (
                                            <div
                                                key={p.course_id}
                                                onClick={() => setSelectedCourseId(isSelected ? null : p.course_id)}
                                                style={{
                                                    padding: '1rem',
                                                    background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    border: isSelected ? '1px solid var(--primary-light)' : '1px solid rgba(255,255,255,0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    transition: 'all 0.2s ease',
                                                    minWidth: '200px'
                                                }}
                                            >
                                                <span style={{ fontSize: '1.5rem' }}>{cData?.icon || cData?.thumbnail || '📚'}</span>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{cData?.title || 'Curso Excluído'}</span>
                                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Score: {p.score}/{p.total_questions}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {selectedCourseId && (
                            <div className="rh-answers-list fade-in">
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary-light)' }}>
                                    Histórico: {coursesMap[selectedCourseId]?.title}
                                </h3>
                                {isLoadingAnswers ? (
                                    <p>Buscando histórico do banco de dados...</p>
                                ) : userAnswers.filter(a => a.courseId === selectedCourseId).length === 0 ? (
                                    <p>Nenhuma resposta registrada para este treinamento.</p>
                                ) : (
                                    <div className="rh-answers-table-wrapper">
                                        <table className="rh-answers-table">
                                            <thead>
                                                <tr>
                                                    <th>Questão/Cenário</th>
                                                    <th>Resposta Final</th>
                                                    <th>Resultado</th>
                                                    <th>Tentativas</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userAnswers.filter(a => a.courseId === selectedCourseId).map(ans => (
                                                    <tr key={ans.id}>
                                                        <td title={ans.question_text}>{ans.question_text?.substring(0, 70)}...</td>
                                                        <td title={ans.answer_text}>{ans.answer_text?.substring(0, 50)}</td>
                                                        <td style={{ color: ans.is_correct ? 'var(--success)' : 'var(--danger)' }}>
                                                            {ans.is_correct ? '✅ Sim' : '❌ Não'}
                                                        </td>
                                                        <td style={{ fontWeight: 'bold' }}>
                                                            {ans.attempts}x
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default RHDashboard;
