import { useState } from 'react';
import Button from './Button';
import './ScenarioSimulator.css';

const ScenarioSimulator = ({ context, question, options, onComplete }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleSelect = (idx) => {
        if (showFeedback) return; // Prevent double clicking
        setSelectedOption(idx);
        setShowFeedback(true);
    };

    const handleContinue = () => {
        // Pass back if the user got it right or wrong to score
        onComplete(options[selectedOption].isCorrect, options[selectedOption].text);
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
                        } else if (option.isCorrect) {
                            btnClass = "show-correct-hint";
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
                        <Button variant={options[selectedOption].isCorrect ? "success" : "primary"} onClick={handleContinue}>
                            Continuar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScenarioSimulator;
