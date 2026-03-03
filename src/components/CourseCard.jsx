import './CourseCard.css';
import Button from './Button';
import { RotateCcw } from 'lucide-react';

const CourseCard = ({ course, isCompleted, isInProgress, onStart, onRestart }) => {
    return (
        <div className={`course-card ${isCompleted ? 'completed' : ''} ${isInProgress ? 'in-progress' : ''}`}>
            <div className="course-icon">{course.icon}</div>
            <div className="course-info">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <span className="course-meta">⏱ {course.duration}</span>
            </div>

            <div className="course-action">
                {isCompleted ? (
                    <div className="card-action-group">
                        <div className="badge-completed">✅ Concluído</div>
                        <button
                            className="icon-restart-btn"
                            onClick={() => onRestart && onRestart(course.id)}
                            title="Refazer curso do início"
                        >
                            <RotateCcw size={16} />
                            Refazer
                        </button>
                    </div>
                ) : isInProgress ? (
                    <div className="card-action-group">
                        <Button variant="primary" onClick={() => onStart(course.id)}>
                            Continuar ▶
                        </Button>
                        <button
                            className="icon-restart-btn"
                            onClick={() => onRestart && onRestart(course.id)}
                            title="Recomeçar do início"
                        >
                            <RotateCcw size={16} />
                            Reiniciar
                        </button>
                    </div>
                ) : (
                    <Button variant="primary" onClick={() => onStart(course.id)}>
                        Iniciar Treinamento
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CourseCard;
