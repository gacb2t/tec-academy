import { useState } from 'react';
import Button from './Button';
import './ScenarioSimulator.css';

const ScenarioSimulator = ({ context, question, options, onComplete, onNextStep }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleSelect = (idx) => {
        if (showFeedback || isCompleted) return; // Prevent double clicking
        setSelectedOption(idx);
        setShowFeedback(true);
        if (options[idx].isCorrect) {
            setIsCompleted(true);
        }
    };

    const handleContinue = () => {
        onComplete(true, options[selectedOption].text, attempts);
        if (onNextStep) {
            onNextStep();
        }
    };

    const handleRetry = () => {
        setAttempts(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
    };

    return (
        <div className="scenario-container glass-panel">
            <div className="scenario-context">
                <span className="scenario-badge">Simulação Prática</span>
                <p className="context-text">{context}</p>
            </div>

            <div className="scenario-question">
                <h3>{question}</h3>
            </div>

            <div className="scenario-options">
                {options.map((option, idx) => {
                    let btnClass = "";
                    if (showFeedback) {
                        if (idx === selectedOption) {
                            btnClass = option.isCorrect ? "selected-correct" : "selected-wrong";
                        } else {
                            btnClass = "disabled-fade";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            className={`gamified-scenario-btn ${btnClass}`}
                            onClick={() => handleSelect(idx)}
                            disabled={showFeedback}
                        >
                            <div className="btn-content-flex">
                                {showFeedback && idx === selectedOption && (
                                    <span className="feedback-icon">{option.isCorrect ? '✅' : '❌'}</span>
                                )}
                                <span>{option.text}</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {showFeedback && (
                <div className={`scenario-feedback slide-up ${options[selectedOption].isCorrect ? 'feedback-success' : 'feedback-error'}`}>
                    <h4>{options[selectedOption].isCorrect ? 'Excelente Escolha!' : 'Atenção ao Risco!'}</h4>
                    <p>{options[selectedOption].feedback}</p>
                    <div className="feedback-action">
                        {options[selectedOption].isCorrect ? (
                            <Button variant="success" onClick={handleContinue}>Continuar Etapa</Button>
                        ) : (
                            <Button variant="outline" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={handleRetry}>🔁 Tentar Novamente</Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScenarioSimulator;
