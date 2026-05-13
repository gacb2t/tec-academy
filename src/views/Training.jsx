import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ProgressBar from '../components/ProgressBar';
import QuizCard from '../components/QuizCard';
import FlipCard from '../components/FlipCard';
import ScenarioSimulator from '../components/ScenarioSimulator';
import Button from '../components/Button';
import Carousel from '../components/Carousel';
import OpenQuestion from '../components/OpenQuestion';
import { courseService } from '../services/courseService';
import './Training.css';

const Training = ({ courseId, onComplete, onAbort }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [allAnswers, setAllAnswers] = useState([]);
    const [animationKey, setAnimationKey] = useState(0);

    const rootRef = useRef(null);
    const [videoTimer, setVideoTimer] = useState(0);
    const [videoCanProceed, setVideoCanProceed] = useState(true);

    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await courseService.getCourseById(courseId);
                setCourse(data);
            } catch (error) {
                console.error("Failed to load course details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    useEffect(() => {
        if (!course) return;
        const currentModule = course.modules?.[currentIndex];

        if (currentModule && currentModule.type === 'video' && currentModule.requireDelay) {
            setVideoCanProceed(false);
            setVideoTimer(currentModule.requireDelay);
        } else {
            setVideoCanProceed(true);
            setVideoTimer(0);
        }
    }, [currentIndex, course]);

    useEffect(() => {
        if (!videoCanProceed && videoTimer > 0) {
            const timerId = setTimeout(() => {
                setVideoTimer(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        } else if (videoTimer === 0 && !videoCanProceed) {
            setVideoCanProceed(true);
        }
    }, [videoTimer, videoCanProceed]);

    if (isLoading) return <div className="loading-screen" style={{ height: '100vh' }}>Preparando ambiente de treinamento...</div>;
    if (!course) return <div>Curso não encontrado.</div>;

    // Safety check: Prevent crashing if the course has no modules yet
    const trainingModules = course.modules || [];

    // Calculate actual scorable questions to grade later (safe now)
    const totalQuestions = trainingModules.filter(m =>
        m.type === 'quiz' || m.type === 'scenario' || m.type === 'swipecards' || m.type === 'drag_drop_sort'
    ).length;

    if (trainingModules.length === 0) {
        return (
            <div className="training-view" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ textAlign: 'center', background: 'var(--panel-bg)', padding: '2rem', borderRadius: '12px' }}>
                    <h2>Ops! 🛠️</h2>
                    <p>Este curso ainda está em construção e não possui módulos.</p>
                    <Button onClick={onAbort} variant="primary" style={{ marginTop: '1rem' }}>Voltar ao Dashboard</Button>
                </div>
            </div>
        );
    }

    const currentStep = trainingModules[currentIndex];
    const totalSteps = trainingModules.length;

    // Check if step is complete (all interactive blocks handled)
    const canAdvanceStep = () => {
        // Find blocks that require interaction to proceed (quizzes, videos with delays, forms)
        // For MVP we will let the user advance freely unless it's a video delay
        if (!videoCanProceed) return false;
        return true;
    };

    const handleNextStep = (overrideScore, overrideAnswers) => {
        const finalScore = typeof overrideScore === 'number' ? overrideScore : score;
        const finalAnswers = Array.isArray(overrideAnswers) ? overrideAnswers : allAnswers;

        if (rootRef.current) {
            rootRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        if (currentIndex < totalSteps - 1) {
            setCurrentIndex(prev => prev + 1);
            setAnimationKey(prev => prev + 1);
        } else {
            const finalPercentage = totalQuestions > 0 ? (finalScore / totalQuestions) : 0;
            if (finalPercentage >= 0.9) {
                confetti({
                    particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 9999
                });
            }
            onComplete({ score: finalScore, totalQuestions, allAnswers: finalAnswers });
        }
    };

    const recordAnswer = (isCorrect, answerText, questionText) => {
        const newAnswerObj = { question: questionText, answer: answerText, correct: isCorrect };
        const newAnswersList = [...allAnswers, newAnswerObj];
        const newCalculatedScore = isCorrect ? score + 1 : score;
        setAllAnswers(newAnswersList);
        setScore(newCalculatedScore);
        return { newCalculatedScore, newAnswersList };
    };

    // Component-level handlers just record the answer but don't force-advance the entire page anymore
    const handleQuizAnswer = (option, questionText) => {
        recordAnswer(option.isCorrect, option.text, questionText);
    };

    const handleMythTruthAnswer = (isTruth, correctIsTruth, explanation, blockTitle) => {
        const isCorrect = isTruth === correctIsTruth;
        recordAnswer(isCorrect, isTruth ? 'Mito' : 'Verdade', blockTitle);
        return isCorrect;
    };

    const handleOpenQuestionComplete = (answerText, questionText) => {
        recordAnswer(false, answerText, questionText);
    };

    const handleFormSubmit = (formData, formTitle) => {
        recordAnswer(false, `Formulário Enviado:\n${Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join('\n')}`, formTitle);
    };

    const renderBlock = (block, bIndex) => {
        switch (block.type) {
            case 'content':
                return (
                    <div key={block._id} className="content-module block-wrapper">
                        {block.title && <h3 className="block-title">{block.title}</h3>}
                        <div className="module-text" dangerouslySetInnerHTML={{ __html: block.content }} />
                    </div>
                );
            case 'video':
                return (
                    <div key={block._id} className="video-module block-wrapper">
                        {block.title && <h3 className="block-title">{block.title}</h3>}
                        <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '1rem', background: '#1e293b' }}>
                            <iframe src={`https://www.youtube.com/embed/${block.videoId}`} loading="lazy" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen title="YouTube Video" />
                        </div>
                    </div>
                );
            case 'quiz':
                return (
                    <div key={block._id} className="quiz-module block-wrapper">
                        <QuizCard question={block.question} options={block.options} onAnswer={(opt) => handleQuizAnswer(opt, block.question)} />
                    </div>
                );
            case 'open_question':
                return (
                    <div key={block._id} className="open-question-module block-wrapper">
                        <OpenQuestion context={block.context} question={block.question} onComplete={(success, ans) => handleOpenQuestionComplete(ans, block.question)} />
                    </div>
                );
            case 'carousel':
                return (
                    <div key={block._id} className="carousel-module block-wrapper">
                        <Carousel slides={block.slides} onComplete={() => { }} />
                    </div>
                );
            case 'myth_truth':
                return (
                    <div key={block._id} className="myth-module block-wrapper" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 className="block-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{block.question}</h3>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <Button variant="outline" onClick={() => {
                                const correct = handleMythTruthAnswer(true, block.defaultIsTruth, block.defaultExplanation, block.question);
                                alert(correct ? "Acertou! Verdade.\n\n" + (block.defaultExplanation || '') : "Errou! Tente entender.\n\n" + (block.defaultExplanation || ''));
                            }}>✅ Verdadeiro</Button>

                            <Button variant="outline" onClick={() => {
                                const correct = handleMythTruthAnswer(false, block.defaultIsTruth, block.defaultExplanation, block.question);
                                alert(correct ? "Acertou! Mito.\n\n" + (block.defaultExplanation || '') : "Errou! Tente entender.\n\n" + (block.defaultExplanation || ''));
                            }}>❌ Mito / Fake</Button>
                        </div>
                    </div>
                );
            case 'advanced_form':
                return (
                    <div key={block._id} className="form-module block-wrapper" style={{ background: 'rgba(30,41,59,0.5)', padding: '2rem', borderRadius: '12px' }}>
                        <h3 className="block-title">{block.defaultTitle}</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());
                            handleFormSubmit(data, block.defaultTitle);
                            alert("Formulário Salvo!");
                        }}>
                            {block.defaultFields?.map(f => (
                                <div key={f.id} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{f.label} {f.required && <span style={{ color: '#ef4444' }}>*</span>}</label>
                                    {f.type === 'textarea' ? (
                                        <textarea name={f.label} required={f.required} rows={3} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '6px' }} />
                                    ) : (
                                        <input type={f.type} name={f.label} required={f.required} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '6px' }} />
                                    )}
                                </div>
                            ))}
                            <Button variant="primary" style={{ width: '100%', marginTop: '1rem' }}>Enviar Respostas</Button>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="training-view" ref={rootRef}>
            <div className="training-top-bar">
                <button className="back-btn" onClick={onAbort}>← Sair do Curso</button>
            </div>

            <div className="training-header">
                <ProgressBar current={currentIndex + 1} total={totalSteps} />
            </div>

            <div className="training-body" key={animationKey}>
                <div className="step-page-container slide-enter" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                    {/* Render Title of Step if exists */}
                    {currentStep.title && <h2 className="step-main-title" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>{currentStep.title}</h2>}

                    {/* Render all blocks stacked vertically */}
                    {currentStep.blocks?.map((block, index) => renderBlock(block, index))}

                    <div className="step-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <Button onClick={handleNextStep} variant="primary" disabled={!canAdvanceStep()}>
                            {currentIndex === totalSteps - 1 ? 'Concluir Treinamento 🏆' : 'Continuar para a Próxima Etapa ➡️'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Training;
