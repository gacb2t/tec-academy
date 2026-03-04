import { useState } from 'react';
import Button from './Button';
import './OpenQuestion.css';

const OpenQuestion = ({ context, question, onComplete, onNextStep }) => {
    const [answer, setAnswer] = useState('');

    const handleSubmit = () => {
        if (answer.trim().length < 10) {
            alert('Por favor, escreva uma resposta um pouco mais detalhada (mínimo 10 caracteres).');
            return;
        }
        onComplete(true, answer);
        onNextStep && onNextStep();
    };

    return (
        <div className="open-question-container slide-enter">
            {context && (
                <div className="open-question-context">
                    <p>{context}</p>
                </div>
            )}

            <div className="open-question-box">
                <h3 className="open-question-title">{question}</h3>

                <textarea
                    className="open-question-textarea"
                    placeholder="Escreva sua resposta ou análise aqui..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={6}
                />
            </div>

            <div className="module-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
                <Button onClick={handleSubmit} variant="primary" disabled={answer.trim().length === 0}>
                    Enviar Resposta ➡️
                </Button>
            </div>
        </div>
    );
};

export default OpenQuestion;
