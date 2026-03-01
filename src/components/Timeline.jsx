import './Timeline.css';
import Button from './Button';

const Timeline = ({ steps, onComplete }) => {
    return (
        <div className="timeline-container">
            <div className="timeline-wrapper">
                {steps.map((step, index) => (
                    <div key={index} className="timeline-item slide-enter" style={{ animationDelay: `${index * 0.15}s` }}>
                        <div className="timeline-marker">
                            {step.imageUrl ? (
                                <div className="timeline-image-container">
                                    <img src={step.imageUrl} alt={step.title} className="timeline-image" />
                                </div>
                            ) : (
                                <div className="timeline-number">
                                    {step.icon ? step.icon : index + 1}
                                </div>
                            )}
                            {index !== steps.length - 1 && <div className="timeline-line"></div>}
                        </div>
                        <div className="timeline-content">
                            <h3 className="timeline-title">{step.title}</h3>
                            <p className="timeline-text">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="timeline-actions">
                <Button onClick={onComplete} variant="primary">
                    Entendido ➡️
                </Button>
            </div>
        </div>
    );
};

export default Timeline;
