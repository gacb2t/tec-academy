import { useState } from 'react';
import './QuizCard.css';
import Button from './Button';

const QuizCard = ({ title, content, question, options, onAnswer, onNextStep }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleSelectOption = (option, index) => {
        if (isCompleted || showFeedback) return;

        setSelectedOption(index);
        setShowFeedback(true);

        if (option.isCorrect) {
            setIsCompleted(true);
            onAnswer(option, attempts);
        }
    };

    const handleRetry = () => {
        setAttempts(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
    };

    const handleContinue = () => {
        if (onNextStep) onNextStep();
    };

    return (
        <div className="quiz-card glass-panel">
            {title && <h2 className="quiz-title">{title}</h2>}

            {content && (
                <div className="quiz-content">
                    <p>{content}</p>
                </div>
            )}

            {question && (
                <div className="quiz-question-section">
                    <h3 className="quiz-question">{question}</h3>
                    <div className="quiz-options">
                        {options.map((option, index) => {
                            let btnClass = "quiz-option-btn";
                            if (showFeedback) {
                                if (index === selectedOption) {
                                    btnClass += option.isCorrect ? " option-correct" : " option-incorrect";
                                } else {
                                    btnClass += " option-disabled";
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    className={btnClass}
                                    onClick={() => handleSelectOption(option, index)}
                                    disabled={showFeedback}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        marginBottom: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: index === selectedOption && showFeedback ? (option.isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)') : 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        cursor: showFeedback ? 'default' : 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {showFeedback && index === selectedOption && (
                                            <span>{option.isCorrect ? '✅' : '❌'}</span>
                                        )}
                                        {option.text}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {showFeedback && !isCompleted && (
                <div className="quiz-feedback-error slide-up" style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', textAlign: 'center' }}>
                    <h4 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Resposta Incorreta</h4>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>Essa não é a alternativa correta. Tente novamente para avançar no treinamento.</p>
                    <Button variant="outline" onClick={handleRetry} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                        🔁 Tentar Novamente
                    </Button>
                </div>
            )}

            {isCompleted && (
                <div className="quiz-feedback-success slide-up" style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', textAlign: 'center' }}>
                    <h4 style={{ color: '#22c55e', marginBottom: '0.5rem' }}>Acertou!</h4>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>Excelente, você selecionou a alternativa correta.</p>
                    <Button variant="success" onClick={handleContinue}>
                        Continuar Etapa
                    </Button>
                </div>
            )}
        </div>
    );
};

export default QuizCard;
