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

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');

    useEffect(() => {
        const fetchRHStats = async () => {
            try {
                // Fetch user profiles to know departments
                const { data: profiles, error: profErr } = await supabase.from('user_profiles').select('user_id, name, department');
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
            // Fetch answers mapping user progresses ids
            const progressIds = userObj.progressList.map(p => p.id);
            if (progressIds.length === 0) return;

            const { data: answers, error } = await supabase
                .from('course_answers')
                .select(`
                    *,
                    course_progress!inner(
                        course_id
                    ),
                    courses:course_progress(course_id)
                `)
                .in('progress_id', progressIds)
                .order('created_at', { ascending: false });

            // Since it's a bit tricky to join courses directly through progress,
            // we will fetch the course titles separately to ensure it works smoothly
            const courseIdsToFetch = [...new Set(answers?.map(a => a.course_progress?.course_id).filter(Boolean) || [])];

            let coursesMap = {};
            if (courseIdsToFetch.length > 0) {
                const { data: coursesData } = await supabase.from('courses').select('id, title').in('id', courseIdsToFetch);
                coursesData?.forEach(c => coursesMap[c.id] = c.title);
            }

            const enrichedAnswers = answers?.map(a => ({
                ...a,
                courseName: coursesMap[a.course_progress?.course_id] || 'Curso Desconhecido'
            })) || [];

            if (error) throw error;
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
        <div className="rh-dashboard fade-in" style={{ padding: '2rem' }}>
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
                            style={{ width: '250px' }}
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
                <div className="rh-modal-overlay fade-in" onClick={() => setSelectedUser(null)}>
                    <div className="rh-modal-content scale-in" onClick={e => e.stopPropagation()}>
                        <button className="rh-modal-close" onClick={() => setSelectedUser(null)}>✖</button>
                        <h2>Detalhes Analíticos: {selectedUser.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Setor: {selectedUser.department}</p>

                        <div className="rh-answers-list">
                            {isLoadingAnswers ? (
                                <p>Buscando histórico do banco de dados...</p>
                            ) : userAnswers.length === 0 ? (
                                <p>Este usuário ainda não respondeu a nenhuma questão.</p>
                            ) : (
                                <div className="rh-answers-table-wrapper">
                                    <table className="rh-answers-table">
                                        <thead>
                                            <tr>
                                                <th>Curso</th>
                                                <th>Questão/Cenário</th>
                                                <th>Resposta Final</th>
                                                <th>Resultado</th>
                                                <th>Tentativas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userAnswers.map(ans => (
                                                <tr key={ans.id}>
                                                    <td title={ans.courseName} style={{ color: 'var(--primary-light)', fontSize: '0.85rem' }}>{ans.courseName}</td>
                                                    <td title={ans.question_text}>{ans.question_text?.substring(0, 50)}...</td>
                                                    <td title={ans.answer_text}>{ans.answer_text?.substring(0, 40)}</td>
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
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default RHDashboard;
