import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../services/supabaseClient';
import Button from '../components/Button';
import './Result.css';

const Result = ({ user, courseId, score, totalQuestions, allAnswers, onToHome, onRetry }) => {
    const { user: clerkUser } = useUser();
    const [status, setStatus] = useState('sending'); // sending, success, error

    // Evaluation State
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [evalStatus, setEvalStatus] = useState('idle'); // idle, sending, success, error

    const handleEvalSubmit = async () => {
        if (rating === 0) return;
        setEvalStatus('sending');
        try {
            const { error: evalErr } = await supabase
                .from('course_evaluations')
                .insert({
                    user_id: clerkUser.id,
                    course_id: courseId,
                    rating: rating,
                    feedback: feedback
                });
            if (evalErr) throw evalErr;

            // Webhook trigger for Eval
            try {
                await fetch('https://hook.us2.make.com/e7e0otybmp16gv7wnklulwuav583w1h1', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eventName: 'novaAvaliacao',
                        user: {
                            id: clerkUser.id,
                            name: user.name,
                            email: user.email,
                            department: user.department
                        },
                        courseId: courseId,
                        rating: rating,
                        feedback: feedback
                    })
                });
            } catch (e) { console.error("Webhook eval error:", e); }

            setEvalStatus('success');
        } catch (err) {
            console.error("Erro ao enviar avaliação:", err);
            setEvalStatus('error');
        }
    };

    useEffect(() => {
        async function saveToDatabase() {
            try {
                const percentage = Math.round((score / totalQuestions) * 100) || 0;

                // 1. Busca o registro existente para saber quantas tentativas já aconteceram
                const { data: existingProgress } = await supabase
                    .from('course_progress')
                    .select('id, attempts_count')
                    .eq('user_id', clerkUser.id)
                    .eq('course_id', courseId)
                    .single();

                const newAttemptsCount = (existingProgress?.attempts_count || 0) + 1;

                // Salva o progresso com contador de tentativas incrementado
                const { data: progressRow, error: progressErr } = await supabase
                    .from('course_progress')
                    .upsert({
                        user_id: clerkUser.id,
                        course_id: courseId,
                        score: score,
                        total_questions: totalQuestions,
                        percentage: percentage,
                        attempts_count: newAttemptsCount
                    }, { onConflict: 'user_id, course_id' })
                    .select('id')
                    .single();

                if (progressErr) throw progressErr;

                // 2. Save individual answers tied to that progress id for Excel exports
                if (progressRow && allAnswers.length > 0) {

                    // Wipe old answers to prevent duplication on retake or React StrictMode double-fire
                    await supabase
                        .from('course_answers')
                        .delete()
                        .eq('progress_id', progressRow.id);

                    const answersToInsert = allAnswers.map(ans => ({
                        progress_id: progressRow.id,
                        question_text: ans.question,
                        answer_text: ans.answer,
                        is_correct: ans.correct
                    }));

                    const { error: answersErr } = await supabase
                        .from('course_answers')
                        .insert(answersToInsert);

                    if (answersErr) throw answersErr;
                }

                // Webhook trigger:
                try {
                    await fetch('https://hook.us2.make.com/e7e0otybmp16gv7wnklulwuav583w1h1', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            eventName: 'cursoConcluido',
                            user: {
                                id: clerkUser.id,
                                name: user.name,
                                email: user.email,
                                department: user.department
                            },
                            courseId: courseId,
                            score: score,
                            totalQuestions: totalQuestions,
                            percentage: percentage,
                            isApproved: percentage >= 90,
                            answers: allAnswers
                        })
                    });
                } catch (e) { console.error("Webhook concluido error:", e); }

                setStatus('success');
            } catch (err) {
                console.error("Erro salvando resultado no DB:", err);
                setStatus('error');
            }
        }

        saveToDatabase();
    }, [clerkUser.id, courseId, score, totalQuestions, allAnswers]);

    const percentage = Math.round((score / totalQuestions) * 100) || 0;
    const isApproved = percentage >= 90;

    return (
        <div className="result-view scale-in">
            <div className="result-header">
                <h1 className="result-title">Treinamento Concluído!</h1>
                <p className="result-subtitle">Obrigado por dedicar seu tempo, {user.name.split(' ')[0]}.</p>
            </div>

            <div className="score-card glass-panel">
                <div className="score-circle">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                        <path className="circle-bg"
                            d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className={`circle ${!isApproved ? 'failed-circle' : ''}`}
                            strokeDasharray={`${percentage}, 100`}
                            d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" className={`percentage ${!isApproved ? 'failed-text' : ''}`}>{percentage}%</text>
                    </svg>
                </div>

                <div className="score-details">
                    <h3>Sua Pontuação</h3>
                    <p>Você acertou <strong>{score}</strong> de <strong>{totalQuestions}</strong> questões.</p>
                    {isApproved ? (
                        <div className="perfect-badge">🌟 Treinamento Aprovado!</div>
                    ) : (
                        <div className="failed-badge" style={{ color: 'var(--danger, #ef4444)', fontWeight: 'bold', marginTop: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px' }}>❌ Mínimo de 90% não atingido no momento.</div>
                    )}
                </div>
            </div>

            <div className="webhook-status">
                {status === 'sending' && (
                    <p className="status-sending">⏳ Sincronizando resultados com o RH...</p>
                )}
                {status === 'success' && (
                    <p className="status-success">✅ Resultados salvos com sucesso no sistema da TEC-B2!</p>
                )}
                {status === 'error' && (
                    <p className="status-error">⚠️ Houve um problema ao salvar os resultados. (Alerte o RH)</p>
                )}
            </div>

            <div className="evaluation-section glass-panel">
                <h3>Avalie este Treinamento</h3>
                <p>Seu feedback é anônimo para o resto dos colegas e nos ajuda a melhorar nossas metodologias.</p>

                {evalStatus === 'success' ? (
                    <div className="eval-success">✅ Muito obrigado pelo seu feedback!</div>
                ) : (
                    <div className="eval-form">
                        <div className="stars-selector">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    className={`star ${rating >= star ? 'active' : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            placeholder="Opcional: Deixe um comentário construtivo sobre o módulo..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="eval-textarea gamified-input"
                            rows="3"
                        ></textarea>
                        <Button
                            variant="primary"
                            onClick={handleEvalSubmit}
                            disabled={rating === 0 || evalStatus === 'sending'}
                        >
                            {evalStatus === 'sending' ? 'Enviando...' : 'Enviar Avaliação Privada'}
                        </Button>
                        {evalStatus === 'error' && <p className="status-error">Houve um erro ao enviar. Tente novamente.</p>}
                    </div>
                )}
            </div>

            <div className="result-actions" style={{ gap: '1rem', display: 'flex', justifyContent: 'center' }}>
                {!isApproved && (
                    <Button onClick={onRetry} variant="primary" style={{ background: 'transparent', border: '1px solid var(--danger, #ef4444)', color: 'var(--danger, #ef4444)' }}>
                        Refazer Curso
                    </Button>
                )}
                <Button onClick={onToHome} variant={isApproved ? "primary" : "secondary"}>
                    Voltar ao Dashboard
                </Button>
            </div>
        </div>
    );
};

export default Result;
