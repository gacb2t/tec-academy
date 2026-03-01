import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ProgressBar from '../components/ProgressBar';
import QuizCard from '../components/QuizCard';
import FlipCard from '../components/FlipCard';
import ScenarioSimulator from '../components/ScenarioSimulator';
import Button from '../components/Button';
import Carousel from '../components/Carousel';
import Timeline from '../components/Timeline';
import AccordionList from '../components/AccordionList';
import OpenQuestion from '../components/OpenQuestion';
import SwipeCards from '../components/SwipeCards';
import AvatarBalloons from '../components/AvatarBalloons';
import WebhookForm from '../components/WebhookForm';
import DragDropSort from '../components/DragDropSort';
import { getCourseById } from '../data/coursesData';
import './Training.css';

const Training = ({ courseId, onComplete, onAbort }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [allAnswers, setAllAnswers] = useState([]);
    const [animationKey, setAnimationKey] = useState(0);

    const rootRef = useRef(null);
    const [videoTimer, setVideoTimer] = useState(0);
    const [videoCanProceed, setVideoCanProceed] = useState(true);

    const course = getCourseById(courseId);
    if (!course) return <div>Curso não encontrado.</div>;

    const trainingModules = course.modules;
    const currentModule = trainingModules[currentIndex];
    const totalSteps = trainingModules.length;

    useEffect(() => {
        if (currentModule && currentModule.type === 'video' && currentModule.requireDelay) {
            setVideoCanProceed(false);
            setVideoTimer(currentModule.requireDelay);
        } else {
            setVideoCanProceed(true);
            setVideoTimer(0);
        }
    }, [currentIndex, currentModule]);

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

    // Calculate actual scorable questions to grade later
    const totalQuestions = trainingModules.filter(m =>
        m.type === 'quiz' || m.type === 'scenario' || m.type === 'swipecards' || m.type === 'drag_drop_sort'
    ).length;

    const handleNext = (finalScore = score, finalAnswers = allAnswers) => {
        // Auto scroll using ref to guarantee it works inside the scrolling container
        if (rootRef.current) {
            rootRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        if (currentIndex < totalSteps - 1) {
            setCurrentIndex(prev => prev + 1);
            setAnimationKey(prev => prev + 1); // trigger re-render animation
        } else {
            // Finished
            const finalPercentage = totalQuestions > 0 ? (finalScore / totalQuestions) : 0;
            if (finalPercentage >= 0.9) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    zIndex: 9999
                });
            }
            onComplete({ score: finalScore, totalQuestions, allAnswers: finalAnswers }); // Send full payload back
        }
    };

    const recordAnswer = (isCorrect, answerText, questionText) => {
        const newAnswerObj = { question: questionText, answer: answerText, correct: isCorrect };
        const newAnswersList = [...allAnswers, newAnswerObj];
        const newCalculatedScore = isCorrect ? score + 1 : score;

        // Still update state for UI/future renders
        setAllAnswers(newAnswersList);
        setScore(newCalculatedScore);

        return { newCalculatedScore, newAnswersList };
    };

    const handleQuizAnswer = (option) => {
        const { newCalculatedScore, newAnswersList } = recordAnswer(option.isCorrect, option.text, currentModule.question);
        handleNext(newCalculatedScore, newAnswersList);
    };

    const handleScenarioComplete = (isCorrect, answerText) => {
        const { newCalculatedScore, newAnswersList } = recordAnswer(isCorrect, answerText, currentModule.question);
        handleNext(newCalculatedScore, newAnswersList);
    };

    const handleOpenQuestionComplete = (isCorrect, answerText) => {
        // Descriptive questions are saved but not "graded" strictly.
        // Pass false for isCorrect so it doesn't artificially push the score over 100%.
        const { newCalculatedScore, newAnswersList } = recordAnswer(false, answerText, currentModule.question);
        handleNext(newCalculatedScore, newAnswersList);
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
                {/* Render dynamically based on interaction type */}
                {currentModule.type === 'content' && (
                    <div className="content-module slide-enter">
                        <h2 className="module-title">{currentModule.title}</h2>
                        <div className="module-text">
                            {currentModule.html ? (
                                <div dangerouslySetInnerHTML={{ __html: currentModule.content }} />
                            ) : (
                                <p>{currentModule.content}</p>
                            )}
                        </div>
                        <div className="module-actions">
                            <Button onClick={handleNext} variant="primary">
                                Entendido. Continuar ➡️
                            </Button>
                        </div>
                    </div>
                )}

                {currentModule.type === 'quiz' && (
                    <div className="quiz-module slide-enter">
                        <QuizCard
                            question={currentModule.question}
                            options={currentModule.options}
                            onAnswer={handleQuizAnswer}
                        />
                    </div>
                )}

                {currentModule.type === 'flipcard' && (
                    <div className="flipcard-module slide-enter">
                        <h2 className="module-title" style={{ textAlign: 'center' }}>{currentModule.title}</h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{currentModule.instruction}</p>
                        <FlipCard cards={currentModule.cards} />

                        <div className="module-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                            <Button onClick={handleNext} variant="primary">
                                Terminei de Revisar
                            </Button>
                        </div>
                    </div>
                )}

                {currentModule.type === 'scenario' && (
                    <div className="scenario-module slide-enter">
                        <ScenarioSimulator
                            context={currentModule.context}
                            question={currentModule.question}
                            options={currentModule.options}
                            onComplete={handleScenarioComplete}
                        />
                    </div>
                )}

                {currentModule.type === 'video' && (
                    <div className="video-module slide-enter">
                        <h2 className="module-title" style={{ textAlign: 'center' }}>{currentModule.title}</h2>
                        {currentModule.description && <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>{currentModule.description}</p>}

                        <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', background: '#1e293b' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-secondary)', zIndex: 0 }}>⏳ Carregando vídeo...</div>
                            <iframe
                                src={`https://www.youtube.com/embed/${currentModule.videoId}`}
                                loading="lazy"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', zIndex: 1 }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="YouTube video player"
                            ></iframe>
                        </div>

                        <div className="module-actions" style={{ justifyContent: 'center' }}>
                            <Button onClick={handleNext} variant="primary" disabled={!videoCanProceed}>
                                {videoCanProceed ? 'Concluí de Assistir ➡️' : `Assista ao vídeo para avançar (${videoTimer}s)`}
                            </Button>
                        </div>
                    </div>
                )}

                {currentModule.type === 'carousel' && (
                    <div className="carousel-module slide-enter" style={{ width: '100%' }}>
                        <Carousel
                            slides={currentModule.slides}
                            onComplete={handleNext}
                        />
                    </div>
                )}

                {currentModule.type === 'timeline' && (
                    <div className="timeline-module slide-enter" style={{ width: '100%' }}>
                        <h2 className="module-title" style={{ textAlign: 'center' }}>{currentModule.title}</h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{currentModule.instruction}</p>
                        <Timeline
                            steps={currentModule.steps}
                            onComplete={handleNext}
                        />
                    </div>
                )}

                {currentModule.type === 'accordion' && (
                    <div className="accordion-module slide-enter" style={{ width: '100%' }}>
                        <h2 className="module-title" style={{ textAlign: 'center' }}>{currentModule.title}</h2>
                        <AccordionList
                            items={currentModule.items}
                            instruction={currentModule.instruction}
                            onComplete={handleNext}
                        />
                    </div>
                )}

                {currentModule.type === 'open_question' && (
                    <div className="open-question-module slide-enter" style={{ width: '100%' }}>
                        <OpenQuestion
                            context={currentModule.context}
                            question={currentModule.question}
                            onComplete={handleOpenQuestionComplete}
                        />
                    </div>
                )}

                {currentModule.type === 'swipecards' && (
                    <div className="swipecards-module slide-enter" style={{ width: '100%' }}>
                        <SwipeCards
                            cards={currentModule.cards}
                            instruction={currentModule.instruction}
                            onComplete={(isCorrect, ans) => {
                                const { newCalculatedScore, newAnswersList } = recordAnswer(isCorrect, ans, currentModule.title || 'Mito ou Verdade (Deslize)');
                                handleNext(newCalculatedScore, newAnswersList);
                            }}
                        />
                    </div>
                )}

                {currentModule.type === 'avatar_balloons' && (
                    <div className="avatar-module slide-enter" style={{ width: '100%' }}>
                        <AvatarBalloons
                            instruction={currentModule.instruction}
                            avatarUrl={currentModule.avatarUrl}
                            balloons={currentModule.balloons}
                            onComplete={() => handleNext()}
                        />
                    </div>
                )}

                {currentModule.type === 'webhook_form' && (
                    <div className="webhook-form-module slide-enter" style={{ width: '100%' }}>
                        <h2 className="module-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{currentModule.title}</h2>
                        <WebhookForm
                            instruction={currentModule.instruction}
                            webhookUrl={currentModule.webhookUrl}
                            onComplete={(isCorrect, ans) => {
                                const { newCalculatedScore, newAnswersList } = recordAnswer(false, `Formulário Enviado: ${JSON.stringify(ans)}`, currentModule.title);
                                handleNext(newCalculatedScore, newAnswersList);
                            }}
                        />
                    </div>
                )}

                {currentModule.type === 'drag_drop_sort' && (
                    <div className="drag-drop-module slide-enter" style={{ width: '100%' }}>
                        <h2 className="module-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{currentModule.title}</h2>
                        <DragDropSort
                            instruction={currentModule.instruction}
                            steps={currentModule.steps}
                            onComplete={() => {
                                // Since validation happens inside, it's always correct when this triggers
                                const { newCalculatedScore, newAnswersList } = recordAnswer(true, "Ordem Correta", currentModule.title || 'Ordenação Lógica');
                                handleNext(newCalculatedScore, newAnswersList);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Training;
