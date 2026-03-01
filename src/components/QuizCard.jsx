import './QuizCard.css';
import Button from './Button';

const QuizCard = ({ title, content, question, options, onAnswer }) => {
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
                        {options.map((option, index) => (
                            <Button
                                key={index}
                                variant="secondary"
                                fullWidth
                                onClick={() => onAnswer(option)}
                                className="quiz-option-btn"
                            >
                                {option.text}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizCard;
