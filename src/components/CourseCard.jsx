import './CourseCard.css';
import Button from './Button';

const CourseCard = ({ course, isCompleted, isInProgress, onStart }) => {
    return (
        <div className={`course-card ${isCompleted ? 'completed' : ''}`}>
            <div className="course-icon">{course.icon}</div>
            <div className="course-info">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <span className="course-meta">⏱ {course.duration}</span>
            </div>

            <div className="course-action">
                {isCompleted ? (
                    <div className="completed-actions">
                        <div className="badge-completed">
                            ✅ Concluído
                        </div>
                        <Button variant="secondary" onClick={() => onStart(course.id)} className="retake-btn">
                            Revisar Treinamento
                        </Button>
                    </div>
                ) : (
                    <Button variant={isInProgress ? "success" : "primary"} onClick={() => onStart(course.id)}>
                        {isInProgress ? 'Continuar Assistindo ➡️' : 'Iniciar Treinamento'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CourseCard;
