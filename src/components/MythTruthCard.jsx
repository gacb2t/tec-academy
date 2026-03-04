import { useState } from 'react';
import Button from './Button';

const MythTruthCard = ({ question, isTruth, explanation, onAnswer, onNextStep }) => {
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null); // true = Verdade, false = Mito
    const [attempts, setAttempts] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleSelect = (choice) => {
        if (isCompleted || showFeedback) return;

        setSelectedAnswer(choice);
        setShowFeedback(true);

        const correct = choice === isTruth;
        if (correct) {
            setIsCompleted(true);
            onAnswer(correct, choice ? 'Verdade' : 'Mito', attempts);
        }
    };

    const handleRetry = () => {
        setAttempts(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
    };

    const handleContinue = () => {
        if (onNextStep) onNextStep();
    };

    return (
        <div className="myth-module block-wrapper" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="block-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{question}</h3>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button
                    variant={showFeedback && selectedAnswer === true ? (isTruth ? "success" : "secondary") : "outline"}
                    onClick={() => handleSelect(true)}
                    disabled={showFeedback}
                    style={{ opacity: showFeedback && selectedAnswer !== true ? 0.5 : 1 }}
                >
                    ✅ Verdadeiro
                </Button>

                <Button
                    variant={showFeedback && selectedAnswer === false ? (!isTruth ? "success" : "secondary") : "outline"}
                    onClick={() => handleSelect(false)}
                    disabled={showFeedback}
                    style={{ opacity: showFeedback && selectedAnswer !== false ? 0.5 : 1 }}
                >
                    ❌ Mito / Fake
                </Button>
            </div>

            {showFeedback && !isCompleted && (
                <div className="quiz-feedback-error slide-up" style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', textAlign: 'center' }}>
                    <h4 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Atenção!</h4>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>{explanation || 'Essa não é a classificação correta.'}</p>
                    <Button variant="outline" onClick={handleRetry} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                        🔁 Tentar Novamente
                    </Button>
                </div>
            )}

            {isCompleted && (
                <div className="quiz-feedback-success slide-up" style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', textAlign: 'center' }}>
                    <h4 style={{ color: '#22c55e', marginBottom: '0.5rem' }}>Muito bem!</h4>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>{explanation || 'Classificação correta.'}</p>
                    <Button variant="success" onClick={handleContinue}>
                        Continuar Etapa
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MythTruthCard;
